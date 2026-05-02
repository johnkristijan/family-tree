#!/usr/bin/env bash
# Deploy family-tree to production.
#
# Usage:
#   ./deploy_prod.sh
#
# Requires: rsync, ssh, docker compose on the remote (run install_server.sh once first).
set -euo pipefail

REMOTE_USER=${REMOTE_USER:-root}
REMOTE_HOST=${REMOTE_HOST:-10.34.12.231}
REMOTE_SSH_PORT=${REMOTE_SSH_PORT:-22}
APP_DIR=${APP_DIR:-/opt/family-tree}
DATA_DIR=${DATA_DIR:-/var/lib/family-tree}
HEALTH_URL=${HEALTH_URL:-https://herrmann.no/api/persons}
LOCAL_DIR=$(cd "$(dirname "$0")" && pwd)

REMOTE="${REMOTE_USER}@${REMOTE_HOST}"
SSH_OPTS=(-p "${REMOTE_SSH_PORT}" -o ConnectTimeout=10)
RSYNC_SSH="ssh -p ${REMOTE_SSH_PORT} -o ConnectTimeout=10"

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
fail() { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

step "Sanity check: ssh to ${REMOTE}"
ssh "${SSH_OPTS[@]}" "${REMOTE}" 'docker --version && docker compose version' \
  || fail "Remote not ready. Run deploy/install_server.sh on the server first."

step "Rsync repo to ${REMOTE}:${APP_DIR}"
rsync -az --delete \
  -e "${RSYNC_SSH}" \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='dist/' \
  --exclude='backend/uploads/' \
  --exclude='*.sqlite-journal' \
  --exclude='.DS_Store' \
  --exclude='docs/' \
  "${LOCAL_DIR}/" "${REMOTE}:${APP_DIR}/"

step "Bootstrap DB if missing (first deploy only)"
ssh "${SSH_OPTS[@]}" "${REMOTE}" bash <<EOF
  set -euo pipefail
  mkdir -p ${DATA_DIR}/db ${DATA_DIR}/uploads
  if [[ ! -f ${DATA_DIR}/db/familytree.sqlite ]]; then
    echo "  -> seeding DB from repo (first deploy)"
    cp ${APP_DIR}/backend/familytree.sqlite ${DATA_DIR}/db/familytree.sqlite
    chown 1000:1000 ${DATA_DIR}/db/familytree.sqlite
  else
    echo "  -> DB already present at ${DATA_DIR}/db/familytree.sqlite (untouched)"
  fi
EOF

step "Build and start containers"
ssh "${SSH_OPTS[@]}" "${REMOTE}" bash <<EOF
  set -euo pipefail
  cd ${APP_DIR}
  docker compose -f docker-compose.prod.yml up -d --build
  docker image prune -f >/dev/null
  docker compose -f docker-compose.prod.yml ps
EOF

step "Health check: ${HEALTH_URL}"
sleep 3
status=$(curl -s -o /dev/null -w '%{http_code}' "${HEALTH_URL}" || true)
if [[ "${status}" == "200" ]]; then
  ok "Backend reachable through nginx (HTTP ${status})"
else
  fail "Health check failed (HTTP ${status})"
fi

step "Health check: https://herrmann.no/"
status=$(curl -s -o /dev/null -w '%{http_code}' "https://herrmann.no/" || true)
if [[ "${status}" == "200" ]]; then
  ok "Frontend reachable (HTTP ${status})"
else
  fail "Frontend health check failed (HTTP ${status})"
fi

ok "Deploy complete."

#!/usr/bin/env bash
# One-shot bootstrap for a fresh Ubuntu 24.04 prod server.
# Idempotent: safe to re-run.
#
# Run on the server (NOT locally) as root:
#   bash install_server.sh
set -euo pipefail

APP_DIR=/opt/family-tree
DATA_DIR=/var/lib/family-tree
NGINX_SITE=/etc/nginx/sites-available/herrmann.no
NGINX_LINK=/etc/nginx/sites-enabled/herrmann.no
SOURCE_NGINX_CONF="${APP_DIR}/deploy/nginx-herrmann.no.conf"

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

if [[ $EUID -ne 0 ]]; then
  echo "Must run as root." >&2
  exit 1
fi

log "Updating apt index"
apt-get update -y

log "Installing prerequisites"
apt-get install -y ca-certificates curl gnupg rsync sqlite3

if ! command -v docker >/dev/null 2>&1; then
  log "Installing Docker Engine + Compose plugin from Docker's official repo"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  log "Docker already installed: $(docker --version)"
fi

log "Enabling docker.service on boot"
systemctl enable --now docker

log "Creating data directories"
mkdir -p "${DATA_DIR}/db" "${DATA_DIR}/uploads"
# Backend container runs as node user (uid 1000 in node:20-alpine).
chown -R 1000:1000 "${DATA_DIR}/db" "${DATA_DIR}/uploads"

log "Creating app directory"
mkdir -p "${APP_DIR}"

if [[ -f "${SOURCE_NGINX_CONF}" ]]; then
  log "Installing nginx site config"
  cp "${SOURCE_NGINX_CONF}" "${NGINX_SITE}"
  ln -sf "${NGINX_SITE}" "${NGINX_LINK}"

  log "Testing nginx config"
  nginx -t

  log "Reloading nginx"
  systemctl reload nginx
else
  log "Nginx source config not found at ${SOURCE_NGINX_CONF}"
  log "Run deploy_prod.sh first to rsync the repo, then re-run this script."
fi

log "Done. Server bootstrap complete."

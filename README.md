# Herrmann Family Tree

A small web app for managing the Herrmann family tree — Vue 3 SPA on the front, Node.js/Express + SQLite on the back. Live at **https://herrmann.no**.

## Project structure

```
backend/             Node.js + Express + TypeScript + SQLite (sqlite3)
frontend-v2/         Vue 3 + Vite + Tailwind v4 + Pinia + Vue Router
deploy/              Server bootstrap script + nginx site config
deploy_prod.sh       One-shot deployment to production
docker-compose.yml         Local Docker setup (optional)
docker-compose.prod.yml    Production Docker setup (used by deploy_prod.sh)
```

The persistent data lives **on the server**, never in the repo:

- `/var/lib/family-tree/db/familytree.sqlite` — live database
- `/var/lib/family-tree/uploads/` — user-uploaded photos

## Local development (macOS)

### Prerequisites

```bash
brew install node yarn git
node -v && yarn --version
```

### 1. Backend (port 3000)

```bash
cd backend
yarn install
yarn start          # ts-node, no build step needed
```

On first run this creates `backend/familytree.sqlite` and initializes the schema.

### 2. Frontend (port 5173)

```bash
cd frontend-v2
yarn install
yarn dev
```

Open the URL Vite prints (default `http://localhost:5173`).

### 3. Login

Password: `starcraft`

### 4. Seed / unseed test data

```bash
cd backend
yarn db:seed        # populate sample persons
yarn db:unseed      # wipe persons + relationships, reset autoincrement
```

## Deployment

Production runs on an Ubuntu 24.04 VM behind nginx with a Let's Encrypt cert for `herrmann.no`. Both services run as Docker containers bound to `127.0.0.1`; the host nginx is the only thing reachable from the internet.

```
Internet ──443──▶ host nginx (TLS) ──┬──▶ 127.0.0.1:8080  frontend container (nginx + dist)
                                     └──▶ 127.0.0.1:3000  backend container  (Express + sqlite3)
                                                          └─ bind mounts
                                                             /var/lib/family-tree/db
                                                             /var/lib/family-tree/uploads
```

`restart: unless-stopped` on the containers + `systemctl enable docker` covers reboots — no separate systemd unit needed.

### First-time server setup (run once)

On a fresh Ubuntu host with nginx + a Let's Encrypt cert already provisioned for `herrmann.no`:

```bash
# from your local machine, in this repo
rsync -az --exclude=.git --exclude=node_modules --exclude=dist \
  ./ root@<your-server>:/opt/family-tree/

ssh root@<your-server> 'bash /opt/family-tree/deploy/install_server.sh'
```

`install_server.sh` is idempotent. It:

1. Installs Docker Engine + Compose plugin from Docker's official APT repo.
2. Enables `docker.service` to start on boot.
3. Creates `/var/lib/family-tree/{db,uploads}` owned by uid 1000 (the container's `node` user).
4. Drops `deploy/nginx-herrmann.no.conf` into `/etc/nginx/sites-available/`, symlinks it into `sites-enabled/`, runs `nginx -t`, and reloads.

### Routine deploys

```bash
./deploy_prod.sh
```

What it does:

1. Sanity-checks ssh + remote `docker compose`.
2. `rsync` the repo to `/opt/family-tree/` (excludes `.git`, `node_modules`, `dist`, `backend/uploads/`, `*.sqlite-journal`, `docs/`).
3. **First deploy only:** seeds `/var/lib/family-tree/db/familytree.sqlite` from `backend/familytree.sqlite` in the repo. Subsequent deploys never touch the live DB.
4. `docker compose -f docker-compose.prod.yml up -d --build`, then `docker image prune -f`.
5. Smoke-tests `https://herrmann.no/api/persons` and `https://herrmann.no/`. Exits non-zero if either isn't 200.

Override defaults via env vars:

```bash
REMOTE_HOST=other.example.com REMOTE_USER=ubuntu ./deploy_prod.sh
```

### Operations cheatsheet

```bash
# Tail container logs
ssh root@<your-server> 'cd /opt/family-tree && docker compose -f docker-compose.prod.yml logs -f'

# Restart just one service
ssh root@<your-server> 'cd /opt/family-tree && docker compose -f docker-compose.prod.yml restart backend'

# Snapshot the live DB
ssh root@<your-server> 'sqlite3 /var/lib/family-tree/db/familytree.sqlite .dump' > backup.sql

# Pull the live DB to local for inspection
scp root@<your-server>:/var/lib/family-tree/db/familytree.sqlite ./backend/familytree.sqlite
```

## Database schema

**`persons`** — `id`, `first_name`, `last_name`, `middle_name`, `birth_date`, `death_date`, `gender`, `bio`, `profession`, `main_photo`, `location`, timestamps.

**`relationships`** — `id`, `person1_id`, `person2_id`, `relationship_type` (e.g. `parent_of`, `married_to`), `start_date`, `end_date`, timestamps.

## Future work

- Visualize the tree graphically (currently a list/detail view)
- Real auth (move beyond the shared password)
- Per-user accounts and audit trail
- Automated DB backups to off-server storage

#!/usr/bin/env bash
set -euo pipefail

# Non-interactive SSH does not load the server's Node/pnpm shell profile.
export PATH="/opt/node-v26.12.1-linux-x64/bin:/root/.nvm/versions/node/v20.20.2/bin:$PATH"
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) process.exit(1)'

# Run inside the isolated server checkout; never run against the production tree.
readonly checkout=/var/www/com_brasper_www_staging
readonly releases=/var/www/releases/brasper-www-staging
cd "$checkout"
[[ $(git branch --show-current) == staging ]] || { echo 'Expected staging branch'; exit 1; }
[[ -z $(git status --porcelain) ]] || { echo 'Checkout has uncommitted changes'; exit 1; }
test -f .env
exec 9> /var/lock/brasper-www-staging-deploy.lock
flock -n 9 || { echo 'Another staging deployment is running'; exit 1; }
git fetch origin staging
git merge --ff-only origin/staging
readonly commit=$(git rev-parse HEAD)
readonly release="$releases/$(date -u +%Y%m%dT%H%M%SZ)-${commit:0:12}"
mkdir -p "$release"
git archive "$commit" | tar --warning=no-timestamp -x -C "$release"
install -m 600 .env "$release/.env"
cd "$release"
pnpm install --frozen-lockfile
pnpm run build:staging
test -s dist/index.html
printf '%s\n' "$commit" > REVISION
ln -s "$release/dist" "$checkout/current.next"
mv -Tf "$checkout/current.next" "$checkout/current"
echo "Staging deployed: $commit"


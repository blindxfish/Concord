#!/bin/bash
set -euo pipefail

# Resolve project directory (script can be run from anywhere)
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
cd "$SCRIPT_DIR"

# Read version from package.json (fallback to date)
if [ -f "package.json" ]; then
  VERSION=$(node -p "require('./package.json').version")
else
  VERSION=$(date +"%Y.%m.%d-%H%M")
fi

# If a container already exists for this VERSION, auto-bump patch to ensure unique version per build
EXISTING_FOR_VERSION=$(docker ps -a --format '{{.Names}}' | grep -E "^concord-web-${VERSION}-" || true)
if [ -n "${EXISTING_FOR_VERSION}" ]; then
  echo "Version ${VERSION} already has containers. Auto-bumping patch..."
  VERSION=$(node -e 'const fs=require("fs");const p=JSON.parse(fs.readFileSync("package.json","utf8"));const [a,b,c]=p.version.split(".").map(Number);p.version=`${a}.${b}.${c+1}`;fs.writeFileSync("package.json",JSON.stringify(p,null,2));console.log(p.version)')
  echo "New version: ${VERSION}"
fi

TIMESTAMP=$(date +%s)
IMAGE="concord-web:${VERSION}-${TIMESTAMP}"
CONTAINER="concord-web-${VERSION}-${TIMESTAMP}"

echo "Building image ${IMAGE}"
docker build -t "${IMAGE}" .

# Also tag as latest for convenience
docker tag "${IMAGE}" "concord-web:latest"

# Stop currently running container for this service (but do not remove)
EXISTING_RUNNING=$(docker ps --format '{{.Names}}' | grep -E '^concord-web-' || true)
if [ -n "${EXISTING_RUNNING}" ]; then
  echo "Stopping currently running container(s):"
  echo "${EXISTING_RUNNING}" | while read -r c; do
    docker stop "$c" || true
  done
fi

echo "Creating container ${CONTAINER} from ${IMAGE} (previous ones kept stopped)"
docker create \
  --name "${CONTAINER}" \
  --label concord.service="concord-web" \
  --label concord.version="${VERSION}" \
  --label concord.build="${TIMESTAMP}" \
  -p 3002:3000 \
  -e NODE_ENV=production \
  -v /var/run/docker.sock:/var/run/docker.sock \
  "${IMAGE}"

docker start "${CONTAINER}"

echo "Concord is now running at http://localhost:3002"
echo "Version: ${VERSION}"
echo "Container: ${CONTAINER}"

#!/bin/bash
set -euo pipefail

echo "☢️  NUCLEAR DOCKER CLEANUP"
echo "=========================="
echo "⚠️  This will remove ALL Docker data!"
echo ""

read -p "Are you sure you want to continue? Type 'YES' to confirm: " -r
if [[ $REPLY != "YES" ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "🛑 Stopping all containers..."
docker stop $(docker ps -aq) 2>/dev/null || true

echo "🗑️  Removing all containers..."
docker rm $(docker ps -aq) 2>/dev/null || true

echo "🗑️  Removing all images..."
docker rmi $(docker images -aq) --force 2>/dev/null || true

echo "🗑️  Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || true

echo "🗑️  Removing all networks..."
docker network rm $(docker network ls -q) 2>/dev/null || true

echo "🗑️  Removing all build cache..."
docker builder prune -a -f

echo "🗑️  System-wide cleanup..."
docker system prune -a --volumes -f

echo ""
echo "📊 Final Docker usage:"
docker system df

echo ""
echo "✅ Nuclear cleanup complete!"
echo "All Docker data has been removed."

#!/bin/bash
set -euo pipefail

echo "🧹 Docker Cleanup Script"
echo "========================"

echo "📊 Current Docker usage:"
docker system df

echo ""
echo "🗑️  Removing untagged/dangling images..."
docker image prune -f

echo ""
echo "🗑️  Removing unused containers..."
docker container prune -f

echo ""
echo "🗑️  Removing unused networks..."
docker network prune -f

echo ""
echo "🗑️  Removing unused volumes (be careful!)..."
read -p "⚠️  This will remove unused volumes. Continue? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume prune -f
else
    echo "Skipping volume cleanup"
fi

echo ""
echo "📊 Docker usage after cleanup:"
docker system df

echo ""
echo "✅ Cleanup complete!"

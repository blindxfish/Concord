# Concord

Next.js app to list Docker images on the host.

## Prerequisites
- Docker installed and running

## Quick Start (Docker)
```bash
# Build and run with Docker
docker-compose up --build

# Or manually
docker build -t concord .
docker run -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock concord
```

## Development (Local)
```bash
# Prerequisites
- Node.js 18+
- Docker CLI on PATH
- Your user can run: docker images (e.g., be in the docker group)

# Setup
npm install

# Development
npm run dev

# Build
npm run build
```

## Docker Permissions (Local Development)
- If API returns 500, ensure your user can run docker images without sudo.
- Debian/Ubuntu: `sudo usermod -aG docker $USER`, then `newgrp docker`

## API
- GET `/api/docker/images` → returns: repository, tag, id, size, createdSince

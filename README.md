# Concord

A Docker container versioning management tool built with Next.js. Concord provides a container-first approach to managing Docker deployments with easy versioning, rollback capabilities, and comprehensive container lifecycle management.

![Concord](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)
![Docker](https://img.shields.io/badge/Docker-Container%20Management-blue?style=flat-square&logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?style=flat-square&logo=typescript)

## 🚀 Features

- **Container-First Versioning**: Every build creates a new versioned container, older versions remain available for rollback
- **Service Management**: Group containers by service with clear version tracking
- **One-Click Rollback**: Switch between versions instantly without rebuilding
- **Unique Image IDs**: Each container version references its own specific image build
- **Status Management**: Clear running/stopped status with "Previous" version tracking
- **Docker Images Management**: View, create containers from, and delete Docker images
- **Dark/Light Mode**: Built-in theme switching
- **Jenkins Integration**: Ready-to-use Jenkins pipeline examples
- **Automated Versioning**: Build scripts for semantic versioning and container creation

## 🏗️ Architecture

Concord follows a **container-first philosophy**:

1. **Every build creates a new container** with a unique name and version
2. **Older containers are preserved** (stopped) for easy rollback
3. **Only one version per service runs** at any time
4. **Each container references its own image** with unique image IDs

## 📋 Prerequisites

- Docker installed and running
- Node.js 18+ (for local development)
- Your user in the `docker` group (for local development)

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/blindxfish/Concord.git
cd Concord

# Build and run with Docker
docker-compose up --build

# Access Concord at http://localhost:3002
```

### Using Build Scripts

```bash
# Bump version (patch|minor|major)
./bump-version.sh patch

# Build and start new container
./build.sh
```

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Docker Permissions (Local Development)

If you get permission errors, ensure your user can run Docker commands:

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify access
docker images
```

## 📖 Usage

### Container Management

1. **View Services**: Navigate to "Containers" to see all services and their versions
2. **Start/Stop**: Click "Start" to run a version, "Stop" to stop the running version
3. **Rollback**: Click "Start" on any previous version to instantly rollback
4. **Delete**: Remove old versions you no longer need

### Image Management

1. **View Images**: Navigate to "Docker Images" to see all available images
2. **Create Container**: Click "Create Container" to create a new versioned container
3. **Delete Images**: Remove unused images to free up space
4. **Cleanup**: Use "Cleanup Untagged" to remove dangling images

### Naming Convention

Concord follows strict naming conventions:

- **Service Names**: `<project>-<component>` (e.g., `mydevplace-frontend`)
- **Container Names**: `<service>-vX.Y.Z-<timestamp>` (e.g., `concord-web-v1.0.13-1760387055`)
- **Image Tags**: `<service>:vX.Y.Z` (e.g., `concord-web:v1.0.13`)
- **Required Labels**: `concord.service`, `concord.version`, `concord.build`

## 🔧 API Endpoints

### Containers
- `GET /api/docker/containers` - List all containers and images
- `POST /api/docker/containers/{id}/start` - Start a container
- `POST /api/docker/containers/{id}/stop` - Stop a container
- `DELETE /api/docker/containers/{id}/delete` - Delete a container
- `POST /api/docker/containers/create` - Create container from image

### Images
- `GET /api/docker/images` - List all Docker images
- `DELETE /api/docker/images/{id}/delete` - Delete an image
- `POST /api/docker/images/cleanup` - Cleanup untagged images

## 📚 Documentation

Visit the **Naming Guide** in the application for:
- Complete naming conventions
- Docker command examples
- Jenkins pipeline integration
- Best practices and workflows

## 🏭 CI/CD Integration

### Jenkins Pipeline

```groovy
pipeline {
  agent any
  environment {
    SERVICE = 'mydevplace-frontend'
  }
  stages {
    stage('Build & Run') {
      steps {
        script {
          def VERSION = sh(returnStdout: true, script: "node -p \"require('./package.json').version\"").trim()
          def VERSION_V = "v${VERSION}"
          def TIMESTAMP = sh(returnStdout: true, script: 'date +%s').trim()
          def IMAGE = "${SERVICE}:${VERSION_V}"
          def CONTAINER = "${SERVICE}-${VERSION_V}-${TIMESTAMP}"
          
          sh "docker build -t ${IMAGE} ."
          sh "docker tag ${IMAGE} ${SERVICE}:latest"
          sh "docker ps --format '{{.Names}}' | grep -E '^${SERVICE}-' | xargs -r -I{} docker stop {} || true"
          sh """docker create \\
            --name ${CONTAINER} \\
            --label concord.service=${SERVICE} \\
            --label concord.version=${VERSION_V} \\
            --label concord.build=${TIMESTAMP} \\
            -p 3000:3000 -e NODE_ENV=production \\
            ${IMAGE}"""
          sh "docker start ${CONTAINER}"
        }
      }
    }
  }
}
```

## 🎯 Key Benefits

- **Zero-Downtime Deployments**: Switch versions instantly
- **Easy Rollbacks**: One-click rollback to any previous version
- **Version History**: Complete audit trail of all deployments
- **Resource Efficiency**: Only one version runs per service
- **Developer Friendly**: Simple commands and clear interfaces
- **Production Ready**: Built for real-world container management

## 🛡️ Security

- Runs in Docker container with minimal privileges
- Requires Docker socket access for container management
- No persistent data storage (stateless application)
- All operations are logged and auditable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Container management via [Docker API](https://docs.docker.com/engine/api/)
- Icons and UI components from [Heroicons](https://heroicons.com/)

---

**Concord** - Making Docker container versioning simple and powerful. 🐳✨
FROM node:18-alpine

WORKDIR /app

# Install Docker CLI
# Install Docker CLI and SQLite (native deps for better-sqlite3)
RUN apk add --no-cache docker-cli python3 make g++ sqlite

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
# Use npm install to avoid lockfile mismatch during image builds
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

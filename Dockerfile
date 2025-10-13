FROM node:18-alpine

WORKDIR /app

# Install Docker CLI
RUN apk add --no-cache docker-cli

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy workspace package.json files
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies (workspaces will be linked automatically)
RUN npm install

# Copy source code
COPY shared/ ./shared/
COPY server/ ./server/
COPY client/ ./client/
COPY tsconfig.base.json ./

# Build all workspaces (shared -> server -> client)
RUN npm run build

# Expose the Colyseus game server port
EXPOSE 2567

# Set production environment variable so the server serves the built client statically
ENV NODE_ENV=production

# Start the Node.js server
CMD ["node", "server/dist/index.js"]

# backend/Dockerfile

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies (including dev for build)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
# Prune dev dependencies for smaller image
FROM node:18-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts # Install only prod dependencies, ignore scripts like postinstall if any

# Copy built code from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/familytree.sqlite ./familytree.sqlite # Copy the DB file if it exists

# Expose port
EXPOSE 3000

# Command to run the application
# This refers to "serve": "node dist/server.js" in package.json
CMD [ "npm", "run", "serve" ]

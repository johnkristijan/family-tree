# frontend/Dockerfile

# Stage 1: Build
FROM node:18-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set VITE_API_URL if your app uses it at runtime (usually baked in)
# ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine AS production-stage

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx config for SPA
# Create a new nginx.conf
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Proxy API requests to backend if frontend and backend are served on same domain/port by Nginx
    # This is an alternative to CORS if Nginx acts as a reverse proxy for both.
    # For separate services in Docker Compose, direct frontend API calls to backend's Docker DNS name is typical.
    # location /api/ {
    #    proxy_pass http://backend:3000/; # 'backend' is the service name in docker-compose
    #    proxy_set_header Host $host;
    #    proxy_set_header X-Real-IP $remote_addr;
    #    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #    proxy_set_header X-Forwarded-Proto $scheme;
    # }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

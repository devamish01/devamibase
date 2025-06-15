# Multi-stage Docker build for production

# Frontend build stage
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install nginx for serving frontend
RUN apk add --no-cache nginx

# Copy backend
COPY --from=backend /app/server ./server
WORKDIR /app/server

# Copy frontend build
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY deployment-configs/nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80 5000

# Start script
COPY deployment-configs/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]

# Deployment Guide (Ubuntu 24)

This document describes the steps required to deploy the marketplace monitoring frontend application using Docker Compose and Nginx on Ubuntu 24.04.

## Prerequisites

The target server must have the following software installed:

- Git
- Docker Engine
- Docker Compose CLI plugin (without hyphen syntax)

## Docker Compose Deployment

1. Clone or copy the project repository to the target directory:

cd /opt/marketplace-monitor-frontend

2. Create and configure the environment file:

cp .env.example .env

3. Open the `.env` file and set the required backend API URL:

VITE_API_URL=http://your-production-api:3000/api

4. Build and launch the containerized application in detached mode:

docker compose up -d --build

The application will accept connections on port 8080 inside the container environment.

## Environment Variable Handling

Because Vite embeds environment variables statically during the build process, any subsequent modifications to the `VITE_API_URL` value inside the `.env` file require a full rebuild of the Docker image.

To apply changes to environment variables, execute the following commands:

docker compose build --build-arg VITE_API_URL=\$(grep VITE_API_URL .env | cut -d '=' -f2)
docker compose up -d --no-deps --force-recreate

## Nginx Reverse Proxy Configuration

To serve the application securely over standard HTTP/HTTPS ports, configure Nginx as a reverse proxy to forward traffic to the internal port 8080.

Create a configuration file under `/etc/nginx/sites-available/marketplace-monitor` with the following structure:

server {
listen 80;
server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

}

Enable the configuration by creating a symlink and reload Nginx:

ln -s /etc/nginx/sites-available/marketplace-monitor /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

## Health Check and Verification

Verify that the application successfully serves the compiled frontend assets by testing the local port:

curl -I http://localhost:8080

A successful deployment must return an `HTTP/1.1 200 OK` response status code.

## Logs

To monitor runtime output and identify potential issues, inspect the container logs:

docker compose logs marketplace-frontend -f

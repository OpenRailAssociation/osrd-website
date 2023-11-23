---
title: "Docker Compose"
linkTitle: "Docker Compose"
weight: 10
description: Using docker compose for single node deployment
---

The OSRD project includes a `docker-compose.yml` file designed to facilitate the deployment of a fully functional OSRD environment. Primarily intended for development purposes, this Docker Compose configuration can also be adapted for quick, single-node deployments.

## Prerequisites

Before proceeding with the deployment, ensure that you have the following installed:
- Docker
- Docker Compose

## Configuration Overview

The `docker-compose.yml` file defines the following services:

1. **PostgreSQL**: A PostgreSQL database with PostGIS extension. 
2. **Redis**: A Redis server for caching.
3. **Core**: The core OSRD service.
4. **Front**: The front-end service for OSRD.
5. **Editoast**: A OSRD service responsible for various editorial functions.
6. **Gateway**: Serves as the gateway for the OSRD services.
7. **Wait-Healthy**: A utility service to ensure all services are healthy before proceeding.

Each service is configured with health checks, volume mounts and necessary environment variables.

## Deployment Steps

1. **Clone the Repository**: First, clone the OSRD repository to your local machine.
2. **Environment Variables** (optional): Set necessary environment variables if you need to adjust some configurations.
3. **Build and Run**: Navigate to the directory containing `docker-compose.yml` and run:

```bash
docker-compose up --build
```

This command builds the images and starts the services defined in the Docker Compose file.

## Accessing Services

While all HTTP service are used through the gateway (`http://localhost:4000`), you can access directly each service using their exposed ports:

- **PostgreSQL**: Accessible on `localhost:5432`.
- **Redis**: Accessible on `localhost:6379`.
- **Core Service**: Accessible on `localhost:8080`.
- **Front-End**: Accessible on `localhost:3000`.
- **Editoast**: Accessible on `localhost:8090`.

## Notes and Considerations

- This setup is designed for development and quick deployments. For production environments, additional considerations for security, scalability and reliability should be addressed.
- Ensure that the `POSTGRES_PASSWORD` and other sensitive credentials are securely managed, especially in production deployments.


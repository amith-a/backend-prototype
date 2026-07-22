# Backend Prototype

## Stack

- Node.js
- TypeScript
- Express

## Run

npm install

npm run dev


docker compose run --rm api npm run create-admin:prod

----------------------------------------------------------------------
docker compose  -f docker-compose.yml -f compose.prod.yml up --build -d


docker compose -f docker-compose.yml -f compose.prod.yml up -d
docker compose -f docker-compose.yml -f compose.dev.yml up --watch

-------------------------------------------------

Custom Docker networks
Network isolation
Docker secrets
Multi-stage optimizations (distroless, non-root users)
Multi-architecture images (amd64 vs arm64)
Image registries (Docker Hub, ECR, GHCR)
Docker Swarm (less common today)
Kubernetes fundamentals
Docker security and image scanning

-----------------------------------------------

Add the BullMQ worker using the same image but a different command.
Review the entire setup and discuss a few production improvements (e.g., image tagging, profiles, secrets, and deployment considerations). what about this

---------------------------------------------------------------------
docker run --rm -it --entrypoint sh backend-app

----------------------------------------------------------------------------------------
docker compose -f docker-compose.yml -f compose.dev.yml down

docker compose -f docker-compose.yml -f compose.dev.yml build --no-cache api

docker compose -f docker-compose.yml -f compose.dev.yml up --watch

-------------------------------------------------------------------------------------------
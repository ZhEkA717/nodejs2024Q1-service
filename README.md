# [ Part 2] Containerization, Docker and Database & ORM

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

**HTTPS**

```bash
git clone https://github.com/ZhEkA717/nodejs2024Q1-service.git
```

```bash
cd nodejs2024Q1-service
```

```bash
git checkout feat/add-docker
```

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
docker-compose up --build
```
**For the first time:** 
  - in another terminal
  - <CONTAINER_ID> of node app 
```bash
docker ps -a
```
```bash
docker exec -it <CONTAINER_ID> npm run prisma:migrate
```
```bash
docker exec -it <CONTAINER_ID> npx prisma db seed
```
## Use Docker Hub

- **For node image**

  ```bash
  docker pull grushevskiyyevgeniy/node:v1.0
  ```
  Change docker-compose.yml in the root

  ```yml
  image: grushevskiyyevgeniy/node:v1.0
  ```

- **For postrges image**

  ```bash
  docker pull grushevskiyyevgeniy/postgres:v1.0
  ```

  Change docker-compose.yaml in the root

  ```yml
  image: grushevskiyyevgeniy/node:v1.0
  ```
  or create new docker-compose.yml
  
  ```yml
  version: '3.0'

  services:

  node:
    image: grushevskiyyevgeniy/node:v1.0 
    ports:
      - ${PORT}:${PORT}
    depends_on:
      - postgres
    environment:
      - PORT=${PORT}
      - POSTGRES_DB_HOST=postgres
    networks:
      - homenet
    restart: always
  
  postgres:
    image: grushevskiyyevgeniy/postgres:v1.0
    ports:
      - ${POSTGRES_PORT}:${POSTGRES_PORT}
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    networks:
      homenet:
        aliases:
          - postgresdb
    volumes:
      - ./pg_data:/var/lib/postgresql/data
    restart: always

  networks:
  homenet:
    driver: 'bridge'

  volumes:
  postgres-data:

  ```
  create new .env file
  
  ```env
  PORT=4000
  
  POSTGRES_PORT=5432
  POSTGRES_USER=postgres  
  POSTGRES_PASSWORD=postgres
  POSTGRES_DB=postgres
  POSTGRES_DB_HOST=127.0.0.1

  DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_USER}@${POSTGRES_DB_HOST}:5432/test?schema=public
  ```
```bash
docker-compose up --build
```
### For the first time:
  - in another terminal
  - <CONTAINER_ID> of node app  
```bash
docker ps -a
```
```bash
docker exec -it <CONTAINER_ID> npm run prisma:migrate
```
```bash
docker exec -it <CONTAINER_ID> npx prisma db seed
```
## Testing

After application running open new terminal and enter:

```bash
npm run test
```

# [ Part 2] Containerization, Docker and Database & ORM

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

**HTTPS**

```bash
git clone https://github.com/ZhEkA717/nodejs2024Q1-service.git
```

## Change branch

```bash
git checkout feat/add-docker
```

## Installing NPM modules

```bash
npm install
```

## Environment

Create .env and copy data from .env.example

```bash
cp .env.example .env
```

## Run docker compose

You must have Docker Desktop installed and running before running this command

[Get Docker](https://docs.docker.com/get-docker/)

```bash
docker-compose up
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```
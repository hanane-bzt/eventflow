
# EVENTFLOW FULL PROJECT

## Installation

1. Install Node.js and Docker

## Run without Docker

Backend:

cd server
npm install
npm start

Frontend:

cd client
npm install
npm run dev

Open:

http://localhost:5173

## Run with Docker

docker compose up --build

Frontend:

http://localhost:5173

API:

http://localhost:4000/health

## Deploy

docker compose build
docker compose up -d

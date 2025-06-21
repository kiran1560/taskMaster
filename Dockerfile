# Stage 1: Build React frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Build backend and copy React build
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy built React app from frontend build stage
COPY --from=build-frontend /app/client/build ./client/build

EXPOSE 5000

CMD ["node", "server.js"]

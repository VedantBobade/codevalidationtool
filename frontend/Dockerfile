FROM node:23-slim as build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve using static file server
FROM nginx:0C
COPY --from=build /app/build /usr/share/nginx/html

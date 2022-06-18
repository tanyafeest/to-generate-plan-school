FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
RUN mkdir /app/sitzplatzplaner
COPY --from=build-stage /app/dist /app/sitzplatzplaner
COPY nginx.conf /etc/nginx/nginx.conf
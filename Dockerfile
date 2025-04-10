FROM node:23-alpine

WORKDIR /app
COPY . .

RUN npm install && npm run build

ENTRYPOINT ["npm", "run", "preview"]

EXPOSE 4173

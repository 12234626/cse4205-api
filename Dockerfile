FROM node:24-alpine AS builder
WORKDIR /cse4205-api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN wget -O dist/src/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

FROM node:24-alpine
WORKDIR /cse4205-api
COPY --from=builder /cse4205-api/dist ./dist
COPY package*.json ./
RUN npm install --production
EXPOSE 3000

CMD ["node", "dist/src/main.js"]

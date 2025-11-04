FROM node:24-alpine AS builder
WORKDIR /cse4205-api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /cse4205-api
COPY --from=builder /cse4205-api/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "dist/src/main.js"]

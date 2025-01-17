FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY app.js ./
ENV PORT=8080
EXPOSE 8080

CMD ["node", "app.js"]
# Use a light version of Node.js
FROM node:20.11.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port your building service runs on
EXPOSE 4002

CMD ["npm", "start"]
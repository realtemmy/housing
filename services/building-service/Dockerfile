# Use a light version of Node.js
FROM node:22-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=./src/prisma/schema.prisma

RUN npm run build


# Expose the port your building service runs on
EXPOSE 4002

CMD ["npm", "start"]
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# 1. Install ALL dependencies (including dev dependencies like ts-node)
RUN npm install

# 2. Install ts-node globally just to be safe (Fixes 'command not found')
RUN npm install -g ts-node typescript nodemon

COPY . .

EXPOSE 4004
CMD ["npm", "run", "dev"]
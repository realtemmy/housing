FROM node:22-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install

# 1. COPY CODE FIRST (This brings in src/prisma/schema.prisma)
COPY . .

# 2. THEN GENERATE (Now the file exists)
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# 3. Don't forget the build step if using TypeScript!
# (Based on our previous fixes, you likely need this)
RUN npm run build

EXPOSE 4003

CMD ["npm", "start"]
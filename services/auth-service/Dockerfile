# CHANGE THIS LINE:
FROM node:22-alpine      

# The rest remains the same...
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate --schema=./src/prisma/schema.prisma
# RUN npx prisma migrate dev --schema=./src/prisma/schema.prisma
RUN npm run build
EXPOSE 4001
CMD ["npm", "start"]
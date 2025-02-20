# Stage 1: Build the Next.js application
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci
RUN npm run build


# Stage 2: Production image
FROM node:22-alpine AS runner

WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
RUN npm ci --omit=dev
EXPOSE 3000

CMD ["npm", "start"]


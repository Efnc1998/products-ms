# ============================================
# Stage 1: Instalación de dependencias
# ============================================
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    cp -R node_modules /prod_modules && \
    npm ci

# ============================================
# Stage 2: Generación de Prisma Client y Build
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate && \
    npm run build

# ============================================
# Stage 3: Imagen de producción
# ============================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001

COPY --from=dependencies /prod_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

USER nestjs

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

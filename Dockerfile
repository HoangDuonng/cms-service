# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY cms-service/package.json cms-service/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY cms-service/package.json cms-service/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY cms-service/src ./src

# Stage 3: Production
FROM node:18-alpine AS runtime
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodejs -G nodejs
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
RUN mkdir -p logs uploads uploads/media uploads/temp public public/static && \
    chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 8086
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8086/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]

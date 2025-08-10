# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# runs "tsc -p tsconfig.json" and your postbuild (copies index.html)
RUN npm run build

# ---- Run stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Bring over built assets and server code
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# If you have static assets (e.g. public/), copy them too:
# COPY --from=builder /app/server/public ./server/public

# Render provides $PORT; make sure server uses it
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server/server.js"]

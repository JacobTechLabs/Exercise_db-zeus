# JacobTechLabs Fitness API - Docker Build
# Multi-stage build for optimal production image

# Stage 1: Dependencies
FROM oven/bun:1.0 AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Stage 2: Builder
FROM oven/bun:1.0 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript
RUN bun run build

# Stage 3: Production
FROM oven/bun:1.0-slim AS production
WORKDIR /app

# Create non-root user for security
RUN groupadd -r jtl && useradd -r -g jtl jtl

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/data ./src/data

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Switch to non-root user
USER jtl

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["bun", "dist/server.js"]

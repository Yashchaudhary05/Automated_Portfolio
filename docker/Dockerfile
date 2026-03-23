# ── Build stage ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# Copy dependency files first (layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ── Production stage ─────────────────────────────────────
FROM node:20-alpine AS production

# Security: run as non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /build/node_modules ./node_modules

# Copy application source
COPY package*.json ./
COPY src/ ./src/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "src/server.js"]

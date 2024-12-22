FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy project files
COPY . .

# Build the Next.js project
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Final production stage
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy production files and build output from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the necessary port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

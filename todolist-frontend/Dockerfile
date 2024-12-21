# Use a Node.js base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the Next.js project
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

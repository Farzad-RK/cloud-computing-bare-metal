# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy application files
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

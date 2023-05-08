# Base image
FROM node:alpine

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy app source code
COPY . .

# Build the React app
RUN npm run build

# Start the app
CMD ["npm", "start"]

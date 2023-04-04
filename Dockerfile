# Use an official Node.js runtime as a parent image
FROM node:16.14.0-alpine3.14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose port 4200
EXPOSE 4200

# Start the application
CMD ["ng", "serve"]

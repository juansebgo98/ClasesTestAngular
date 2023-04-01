# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install Angular CLI and project dependencies
RUN npm install -g @angular/cli && npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Angular app for production
RUN ng build --prod

# Set the command to start the Angular app when the container starts
CMD ["npm", "start"]

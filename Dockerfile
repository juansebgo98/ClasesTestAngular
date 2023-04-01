# Use an official Node.js runtime as a parent image
FROM node:18.13.0-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install Angular CLI and project dependencies
RUN npm install -g npm@9.3.1 && npm install -g @angular/cli@15.1.6 && npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Angular app for production
RUN ng build

# Exponer el puerto 80 en la imagen
EXPOSE 8081

# Set the command to start the Angular app when the container starts
CMD ["npm", "start"]

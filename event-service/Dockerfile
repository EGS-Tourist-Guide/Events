# Node.js image
FROM node:19

# Metadata
LABEL maintainer="Luis Couto 89078"
LABEL version="1.0"

# Working directory for the app
WORKDIR /usr/src/event-service

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose port for the application
EXPOSE 3000

# Define the command to run the application
CMD [ "node", "index.js" ]
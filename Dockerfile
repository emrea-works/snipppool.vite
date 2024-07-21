# Load the environment variables from the .env file
ARG VITE_CLIENT_PORT
ARG VITE_PORT
ARG VITE_APIURL
ARG VITE_QUERY_RETRIEVE
ARG VITE_QUERY_DELETE
ARG VITE_QUERY_INSERT
ARG DB_SOURCE
ARG TABLE_NAME

# Set the environment variables"
#ENV VITE_CLIENT_PORT=$VITE_CLIENT_PORT
#ENV VITE_PORT=$VITE_PORT
#ENV VITE_APIURL=$VITE_APIURL
#ENV VITE_QUERY_RETRIEVE=$VITE_QUERY_RETRIEVE
#ENV VITE_QUERY_DELETE=$VITE_QUERY_DELETE
#ENV VITE_QUERY_INSERT=$VITE_QUERY_INSERT
#ENV DB_SOURCE=$DB_SOURCE
#ENV TABLE_NAME=$TABLE_NAME

# Copy the script into the image
COPY read_env.sh /usr/local/bin/read_env.sh

# Make the script executable
RUN chmod +x /usr/local/bin/read_env.sh

# Execute the script to load environment variables
RUN /usr/local/bin/read_env.sh

# Use a Node.js base image
FROM node:iron-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Make port available to the world outside this container
EXPOSE $VITE_PORT

# Define the command to run the server app
CMD ["node", "./server.mjs"]

# Add a new stage for the client app
FROM node:iron-alpine
WORKDIR /app/client
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run build

# Define the command to start the client app
CMD ["npm", "preview", "--", "$VITE_CLIENT_PORT"]

# Build command
#docker build \
#	--build-arg VITE_CLIENT_PORT="$VITE_CLIENT_PORT" \
#	--build-arg VITE_PORT="$VITE_PORT" \
#	--build-arg VITE_APIURL="$VITE_APIURL" \
#	--build-arg VITE_QUERY_RETRIEVE="$VITE_QUERY_RETRIEVE" \
#	--build-arg VITE_QUERY_DELETE="$VITE_QUERY_DELETE" \
#	--build-arg VITE_QUERY_INSERT="$VITE_QUERY_INSERT" \
#	--build-arg DB_SOURCE="$DB_SOURCE" \
#	--build-arg TABLE_NAME="$TABLE_NAME" \
#	-f Dockerfile -t snipppool .
# Or simply
#docker build --env-file .env -t snipppool-fullstack | NO_WORKS

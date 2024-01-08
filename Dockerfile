# Use an official Node runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN yarn install

# Expose the port that the app will run on (adjust as needed)
EXPOSE 9000

# Define the command to run your app
CMD ["yarn", "serve"]

#TO START DO
# docker build -t test2 . && docker run -p 9000:9000 test2

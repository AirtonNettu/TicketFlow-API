FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install --production

# Bundle app source
COPY . .

# Ensure data directory exists and set permissions
RUN mkdir -p src/data && chown -R node:node src/data

USER node

EXPOSE 3000
CMD [ "npm", "start" ]
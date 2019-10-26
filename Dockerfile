FROM node:10-alpine

RUN apk add --update python make g++

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --no-progress
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN \
  export GQL_URL='%%GQL_URL%%' && \
  export REST_URL='%%REST_URL%%' && \
  npm run --silent build
RUN npm prune --production

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
#CMD [ "npm", "start" ]
ENTRYPOINT /app/entrypoint.sh

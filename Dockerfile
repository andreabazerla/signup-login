FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV MONGODB_URI_TEST mongodb://localhost:27017/affittagram
RUN npm run pre-dev && npm run build-production
EXPOSE 3000
CMD [ "npm", "start" ]

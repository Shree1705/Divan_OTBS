FROM node:20.5.0

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 5000


CMD ["npm", "start"]

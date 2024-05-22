FROM node:20.12.2

WORKDIR /app

COPY package.json /app

RUN npm install -g npm@latest
RUN npm install

COPY . /app

EXPOSE 4000

CMD ["npm", "start"]
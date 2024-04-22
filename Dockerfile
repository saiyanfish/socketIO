FROM node

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install -g typescript

COPY . .

RUN tsc

COPY dist .

EXPOSE 8888

CMD [ "node", "./dist/app.js" ]
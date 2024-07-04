FROM node

WORKDIR /app/io

COPY package.json .

RUN npm install

RUN npm install -g typescript

COPY . .

RUN tsc

EXPOSE 8888

CMD [ "node", "./dist/app.js" ]
FROM node:20-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
RUN npm run migration:run
RUN npm prune --production
CMD ["mode","./dist/main.js"]
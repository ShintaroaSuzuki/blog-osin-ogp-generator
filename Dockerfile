FROM node:16
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src
COPY images ./images
COPY fonts ./fonts
RUN yarn install
RUN yarn build
CMD ["yarn", "start:prod"]

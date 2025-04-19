FROM node:22 AS build

RUN mkdir -p /usr/app

WORKDIR /usr/app

ARG ENVIRONMENT

COPY ./src ./src
COPY package*.json ./
COPY ./tsconfig*.json ./

RUN npm install
RUN npm run build

FROM node:22 AS prod

WORKDIR /usr/app

COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/tsconfig*.json ./
COPY --from=build /usr/app/package*.json ./
COPY --from=build /usr/app/node_modules node_modules

EXPOSE 3000

CMD ["npm", "start"]

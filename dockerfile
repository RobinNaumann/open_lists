FROM oven/bun:debian

# install the ping command. this is used to check if services are up
RUN apt update && apt install -y iputils-ping

# install ffmpeg for video processing
#RUN apt install -y ffmpeg

RUN mkdir /make
WORKDIR /make

# RUN rm -f bun.lock
COPY package.json bun.lock ./
RUN mkdir /app
RUN bun install --frozen-lockfile
RUN cp -rT /make/node_modules /app/node_modules
COPY ./ ./

# ============ BUILD THE APPLICATION ============
ARG _APP_VERSION="0.1.4"
# update the version label
RUN sed -i "s/const \$APP_VERSION = .*;/const \$APP_VERSION = \"${_APP_VERSION}\";/g" src/shared/info.shared.ts


# build the application
RUN bun run --env-file .env.production build
RUN cp -rT /make/dist /app
RUN rm -rf /make

# set up runtime environment
EXPOSE 80
VOLUME /app/data
LABEL version="${_APP_VERSION}"

WORKDIR /app
ENTRYPOINT ["bun", "./server/app.server.js"]

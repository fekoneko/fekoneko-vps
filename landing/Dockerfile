FROM oven/bun:1 AS build
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile
RUN bun run build
RUN rm -rf node_modules
RUN bun install --frozen-lockfile --production

FROM oven/bun:1 AS deploy
WORKDIR /app

COPY --from=build /app/build build/
COPY --from=build /app/bun.lock .
ENV NODE_ENV=production

USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "run", "build/index.js" ]

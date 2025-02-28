FROM oven/bun:1 AS build
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

FROM oven/bun:1 AS deploy
WORKDIR /app

COPY --from=build /app/build .
ENV NODE_ENV=production
USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "run", "index.js" ]

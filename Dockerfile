# 1) Build
FROM oven/bun:1.1 AS build
WORKDIR /app
COPY package.json bunfig.toml tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN bun install
RUN bunx prisma generate
RUN bun run build
RUN mkdir -p dist/templates && cp -r src/templates/* dist/templates/
CMD [ "bun", "dev" ]

# 2) Runtime
# FROM oven/bun:1.1
# WORKDIR /app
# ENV NODE_ENV=production
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/prisma ./prisma
# EXPOSE 5000
# CMD ["bun", "dist/server.js"]

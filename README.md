# mini-credit-service

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev

```

to run test:
NODE_ENV=test bun test

This project was created using `bun init` in bun v1.2.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Prisma COMMON WORKFLOW COMMANDS

## 1. After schema changes - create migration and apply

npx prisma migrate dev --name your_migration_name

## 2. After schema changes - direct push (for prototyping)

npx prisma db push

## 3. Always generate client after schema changes

npx prisma generate

## 4. Reset everything and start fresh

npx prisma migrate reset
npx prisma generate

## USEFUL ADDITIONAL COMMANDS

## View database in Prisma Studio

npx prisma studio

## Check migration status

npx prisma migrate status

<!-- docker commands -->

## Instead of running from your terminal

docker-compose exec mini-credit-service-app-1 bunx prisma db push

## Or enter the container

docker-compose exec mini-credit-service-app-1 bash

## Then inside container

bunx prisma db push

## format prisma schema

bunx prisma format

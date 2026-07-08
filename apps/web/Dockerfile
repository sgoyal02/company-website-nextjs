FROM node:22-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@11.10.0 --activate
ENV CI=true
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile --filter web... --config.node-linker=hoisted --config.shamefully-hoist=true

COPY apps/web ./apps/web
RUN pnpm --filter web build

WORKDIR /repo/apps/web
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]
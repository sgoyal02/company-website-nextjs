FROM node:22-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@11.10.0 --activate
ENV CI=true
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/cms/package.json ./apps/cms/
COPY apps/cms ./apps/cms

#--add after source code copy -for strapi binary map
RUN pnpm install --frozen-lockfile --filter cms... --config.node-linker=hoisted --config.shamefully-hoist=true
RUN pnpm --filter cms build

WORKDIR /repo/apps/cms
EXPOSE 1337
CMD ["pnpm", "--filter", "cms", "start"]
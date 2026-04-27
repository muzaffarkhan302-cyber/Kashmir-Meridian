FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=s/d347441f-2906-4ea5-9c89-df35ea70f8d9-/root/.npm,target=/root/.npm \
    npm ci --prefer-offline --no-audit

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3000
CMD ["npm", "start"]

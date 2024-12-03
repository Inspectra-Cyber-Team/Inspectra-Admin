# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./


COPY . .

RUN npm i sharp


RUN npm run build

FROM node:18-alpine

RUN apk update && apk upgrade && apk add dumb-init && adduser -D nextuser


WORKDIR /app

# Copy the public folder from the project as this is not included in the build process
COPY --chown=nextuser:nextuser --from=builder /app/public ./public

# Copy the standalone folder inside the .next folder generated from the build process
COPY --chown=nextuser:nextuser --from=builder /app/.next/standalone ./

# Copy the static folder inside the .next folder generated from the build process
COPY --chown=nextuser:nextuser --from=builder /app/.next/static ./.next/static

USER nextuser

EXPOSE 3000

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

# Start the application
CMD ["dumb-init","node","server.js"]
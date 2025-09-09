# syntax=docker/dockerfile:1

###
# Stage 1 — Build the app with Node
###
ARG NODE_IMAGE=node:18-alpine
FROM ${NODE_IMAGE} AS builder

WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# Copy source
COPY . .

# Install missing dependency for build
RUN npm install copy-webpack-plugin --save-dev;

# Default to the script your repo already defines: "build:prod"
# (You can override at build time with --build-arg BUILD_SCRIPT=build:dev)
ARG BUILD_SCRIPT=build:prod
ENV NODE_ENV=production

# Guard: fail early if the script isn't present
RUN node -e "const s=require('./package.json').scripts||{}; if(!s['${BUILD_SCRIPT}']){console.error('ERROR: package.json missing script \"${BUILD_SCRIPT}\"'); process.exit(1)}"

# Build the production bundle
RUN npm run ${BUILD_SCRIPT}

###
# Stage 2 — Runtime (NGINX)
###
FROM nginx:1.25-alpine AS runtime

LABEL org.opencontainers.image.title="BYOR (custom fork)" \
      org.opencontainers.image.description="Custom ThoughtWorks Build Your Own Radar built from Nathan's fork" \
      org.opencontainers.image.source="https://github.com/nathanlo9/build-your-own-radar"

# Where your local CSV/JSON will be mounted
ENV FILES_DIR=/opt/build-your-own-radar/files

# If your webpack output folder differs, override at build-time:
#   --build-arg BUILD_DIR=build
ARG BUILD_DIR=dist

# Copy compiled assets from the builder stage
COPY --from=builder /app/${BUILD_DIR}/ /usr/share/nginx/html/

# NGINX config: serve app + /files alias (for data URLs)
RUN mkdir -p ${FILES_DIR} \
 && rm -f /etc/nginx/conf.d/default.conf \
 && printf '%s\n' \
 'server {' \
 '  listen 80;' \
 '  server_name _;' \
 '  root /usr/share/nginx/html;' \
 '  index index.html;' \
 '' \
 '  # Expose bind-mounted CSV/JSON as /files/' \
 '  location /files/ {' \
 '    alias '"${FILES_DIR}/"';' \
 '    add_header Access-Control-Allow-Origin * always;' \
 '    add_header Cache-Control "no-store";' \
 '    autoindex on;' \
 '  }' \
 '' \
 '  # SPA fallback for client-side routing' \
 '  location / {' \
 '    try_files $uri $uri/ /index.html;' \
 '  }' \
 '}' \
 > /etc/nginx/conf.d/byor.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
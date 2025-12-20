# syntax=docker/dockerfile:1.7

ARG VITE_APP_VERSION=v1.0.0
ARG VITE_APP_BASE_NAME=/liontvpremium
ARG VITE_API_AUTH=http://192.168.1.150:30100/
ARG VITE_API_USERS=http://192.168.1.150:8082/v1
ARG VITE_API_PRODUCTS=http://192.168.1.150:8083/v1
ARG VITE_API_RESERVATIONS=http://192.168.1.150:8084/v1
ARG VITE_API_SMS=
ARG VITE_API_CATALOGS=http://192.168.1.150:30104
ARG VITE_API_LIONTV=http://192.168.1.150:30102
ARG VITE_API_SAGA=http://192.168.1.150:30110
ARG VITE_GOOGLE_CLIENT_ID=881879419726-dviv75rgbqofnh33288jr5loriie72ot.apps.googleusercontent.com

# =========================
# Build stage (Vite build)
# =========================
FROM node:20-alpine AS build

ARG VITE_APP_VERSION
ARG VITE_APP_BASE_NAME
ARG VITE_API_AUTH
ARG VITE_API_USERS
ARG VITE_API_PRODUCTS
ARG VITE_API_RESERVATIONS
ARG VITE_API_SMS
ARG VITE_API_CATALOGS
ARG VITE_API_LIONTV
ARG VITE_API_SAGA
ARG VITE_GOOGLE_CLIENT_ID

WORKDIR /app

ENV NODE_ENV=production \
  VITE_APP_VERSION=${VITE_APP_VERSION} \
  VITE_APP_BASE_NAME=${VITE_APP_BASE_NAME} \
  VITE_API_AUTH=${VITE_API_AUTH} \
  VITE_API_USERS=${VITE_API_USERS} \
  VITE_API_PRODUCTS=${VITE_API_PRODUCTS} \
  VITE_API_RESERVATIONS=${VITE_API_RESERVATIONS} \
  VITE_API_SMS=${VITE_API_SMS} \
  VITE_API_CATALOGS=${VITE_API_CATALOGS} \
  VITE_API_LIONTV=${VITE_API_LIONTV} \
  VITE_API_SAGA=${VITE_API_SAGA} \
  VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

# toolchain por si hay deps nativas
RUN apk add --no-cache python3 make g++ git

# manifests + lockfiles (los * no fallan si no existen)
COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY .yarnrc.yml* ./

# instalar deps
RUN set -eux; \
  if [ -f yarn.lock ]; then \
    corepack enable; \
    yarn install; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable; \
    pnpm install --frozen-lockfile; \
  else \
    npm install; \
  fi

# copiar proyecto
COPY . .

# Build (captura log completo y lo imprime si falla)
RUN set -eux; \
  set -o pipefail; \
  export DEBUG=vite:*; \
  export VITE_LOG_LEVEL=info; \
  echo "=== Node ==="; node -v; \
  echo "=== Package manager ==="; \
  if [ -f yarn.lock ]; then yarn -v; elif [ -f pnpm-lock.yaml ]; then pnpm -v; else npm -v; fi; \
  echo "=== Running build (base=${VITE_APP_BASE_NAME:-/}) ==="; \
  ( \
    if [ -f yarn.lock ]; then \
      yarn build --base "${VITE_APP_BASE_NAME:-/}" --debug; \
    elif [ -f pnpm-lock.yaml ]; then \
      pnpm build -- --base "${VITE_APP_BASE_NAME:-/}" --debug; \
    else \
      npm run build -- --base "${VITE_APP_BASE_NAME:-/}" --debug; \
    fi \
  ) 2>&1 | tee /tmp/vite-build.log; \
  echo "=== Build exit code: $? ==="; \
  echo "=== If build failed, full log below ==="; \
  cat /tmp/vite-build.log; \
  echo "=== End log ==="; \
  BASE_PATH="$(printf '%s' "${VITE_APP_BASE_NAME:-/}" | sed 's#^/##;s#/$##')"; \
  DEST="/app/output"; \
  if [ -n "$BASE_PATH" ]; then DEST="/app/output/${BASE_PATH}"; fi; \
  mkdir -p "$DEST"; \
  cp -r dist/* "$DEST/"

# =========================
# Runtime stage (Nginx)
# =========================
FROM nginx:1.27-alpine AS runner

ARG VITE_APP_BASE_NAME
ENV VITE_APP_BASE_NAME=${VITE_APP_BASE_NAME:-/}

COPY --from=build /app/output/ /usr/share/nginx/html/

RUN set -eux; \
  BASE_PATH="${VITE_APP_BASE_NAME:-/}"; \
  BASE_PATH="${BASE_PATH%/}"; \
  [ -z "$BASE_PATH" ] && BASE_PATH="/"; \
  if [ "$BASE_PATH" = "/" ]; then \
    printf '%s\n' \
      'server {' \
      '  listen 80;' \
      '  server_name _;' \
      '  root /usr/share/nginx/html;' \
      '  location / {' \
      '    try_files $uri $uri/ /index.html;' \
      '  }' \
      '}' \
    > /etc/nginx/conf.d/default.conf; \
  else \
    BASE_PATH="/${BASE_PATH#/}"; \
    printf '%s\n' \
      'server {' \
      '  listen 80;' \
      '  server_name _;' \
      '  root /usr/share/nginx/html;' \
      "  location ${BASE_PATH}/ {" \
      "    try_files \$uri \$uri/ ${BASE_PATH}/index.html;" \
      '  }' \
      '  location / {' \
      "    return 301 ${BASE_PATH}/;" \
      '  }' \
      '}' \
    > /etc/nginx/conf.d/default.conf; \
  fi

EXPOSE 80

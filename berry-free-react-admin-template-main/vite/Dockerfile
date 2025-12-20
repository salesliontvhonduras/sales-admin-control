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

FROM node:22-alpine AS build
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

COPY package.json yarn.lock ./
RUN corepack enable \
  && yarn set version 4.10.3 \
  && yarn install --immutable

COPY . .
RUN yarn build --base "${VITE_APP_BASE_NAME:-/}" \
  && BASE_PATH=$(printf '%s' "${VITE_APP_BASE_NAME:-/}" | sed 's#^/##;s#/$##') \
  && DEST="/app/output" \
  && if [ -n "$BASE_PATH" ]; then DEST="/app/output/${BASE_PATH}"; fi \
  && mkdir -p "$DEST" \
  && cp -r dist/* "$DEST/"

FROM nginx:1.27-alpine AS runner
ARG VITE_APP_BASE_NAME
ENV VITE_APP_BASE_NAME=${VITE_APP_BASE_NAME:-/}

COPY --from=build /app/output/ /usr/share/nginx/html/

RUN BASE_PATH="${VITE_APP_BASE_NAME:-/}" \
  && BASE_PATH="${BASE_PATH%/}" \
  && if [ -z "$BASE_PATH" ]; then BASE_PATH="/"; fi \
  && if [ "$BASE_PATH" != "/" ]; then BASE_PATH="/${BASE_PATH#/}"; fi \
  && if [ "$BASE_PATH" = "/" ]; then \
cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF
     else \
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  location ${BASE_PATH}/ {
    try_files \$uri \$uri/ ${BASE_PATH}/index.html;
  }
  location / {
    return 301 ${BASE_PATH}/;
  }
}
EOF
     fi

EXPOSE 80

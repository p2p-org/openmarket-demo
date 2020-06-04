#!/usr/bin/env sh

find .nuxt/ \
  -type f \
  -name '*.js' \
  -exec sed -i "s+%%GQL_URL%%+${GQL_URL:?}+g" '{}' \; \
  -exec sed -i "s+%%REST_URL%%+${REST_URL:?}+g" '{}' \; \
  -exec sed -i "s+%%TOKEN_PREFIX%%+${TOKEN_PREFIX:?}+g" '{}' \; \
  -exec sed -i "s+%%IBC_SRC%%+${IBC_SRC:?}+g" '{}' \; \
  -exec sed -i "s+%%IBC_DST%%+${IBC_DST:?}+g" '{}' \;

exec npm start

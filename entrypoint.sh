#!/usr/bin/env sh

find .nuxt/ \
  -type f \
  -name '*.js' \
  -exec sed -i "s+%%GQL_URL%%+${GQL_URL:?}+g" '{}' \; \
  -exec sed -i "s+%%REST_URL%%+${REST_URL:?}+g" '{}' \;
#  -exec sed -i "s+%%KEYCLOAK_REALM%%+${KEYCLOAK_REALM:?}+g" '{}' \; \
#  -exec sed -i "s+%%API_BASE_URL%%+${API_BASE_URL:?}+g" '{}' \;

exec npm start

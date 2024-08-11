#!/usr/bin/env sh

APIKEY='secretapikey'

echo "${CERTBOT_DOMAIN}"

domain=$(echo "${CERTBOT_DOMAIN}" | rev | cut -d"." -f1-2 | rev)
subdomain=""

if [ "${domain}" = "${CERTBOT_DOMAIN}" ]; then
        echo 'Same!'
else
        echo 'Different!'
        subdomain=$(echo "${CERTBOT_DOMAIN}" | rev | cut -d"." -f3- | rev)
        subdomain_with_dot=".${subdomain}"
fi

curl -s -X DELETE https://api.gandi.net/v5/livedns/domains/${domain}/records/_acme-challenge${subdomain_with_dot} \
        -H "Authorization: Apikey $APIKEY"
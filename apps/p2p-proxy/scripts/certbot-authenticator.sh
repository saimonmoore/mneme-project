#!/usr/bin/env sh

APIKEY='secretapikey'

echo "${CERTBOT_DOMAIN}"
echo "${CERTBOT_VALIDATION}"

domain=$(echo "${CERTBOT_DOMAIN}" | rev | cut -d"." -f1-2 | rev)
subdomain=""

if [ "${domain}" = "${CERTBOT_DOMAIN}" ]; then
        echo 'Same!'
else
        echo 'Different!'
        subdomain=$(echo "${CERTBOT_DOMAIN}" | rev | cut -d"." -f3- | rev)
        subdomain_with_dot=".${subdomain}"
fi

result=$(curl -s -H "Authorization: Apikey $APIKEY" https://api.gandi.net/v5/livedns/domains/${domain}/records/_acme-challenge${subdomain_with_dot} | python -m json.tool)
if [ "${result}" = "[]" ]; then
        echo 'Newly created!'
        curl -s -X POST https://api.gandi.net/v5/livedns/domains/${domain}/records/_acme-challenge${subdomain_with_dot} \
                -H "Authorization: Apikey $APIKEY" \
                -H "Content-Type: application/json" \
                --data '{"rrset_type": "TXT", "rrset_values": ["'${CERTBOT_VALIDATION}'"], "rrset_ttl": "300"}'

else
        echo 'Append!'
        previous_validation=$(echo "${result}" | python -c "import sys, json; print json.load(sys.stdin)[0]['rrset_values'][0]" | tr -d '"')
        echo 'previsou_validation: '${previous_validation}
        curl -s -X PUT https://api.gandi.net/v5/livedns/domains/${domain}/records/_acme-challenge${subdomain_with_dot} \
                -H "Authorization: Apikey $APIKEY" \
                -H "Content-Type: application/json" \
                --data '{"items": [{"rrset_type": "TXT", "rrset_values": ["'${previous_validation}'", "'${CERTBOT_VALIDATION}'"], "rrset_ttl": "300"}]}'
fi

sleep 30
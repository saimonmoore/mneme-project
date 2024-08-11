APIKEY=${APIKEY:-'secretapikey'}

sed -i "s/secretapitoken/${APIKEY}/g" certbot-authenticator.sh
sed -i "s/secretapitoken/${APIKEY}/g" certbot-authenticator.sh

sudo certbot certonly --manual \
    -d *.internal.saimonmoore.org \
    -d internal.saimonmoore.org \
    --manual-auth-hook certbot-authenticator.sh \
    --manual-cleanup-hook certbot-cleanup.sh \
    --preferred-challenges dns
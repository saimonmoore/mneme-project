# dht-relay

## Building

For development:

`docker build --target development -f docker/Dockerfile -t org.saimonmoore/mneme/dht-relay:dev .`

(for production, ensure, the correct certs are in place and use `production` as the target)

## Running

For development:

`docker run -e NODE_ENV=development -e PORT=49443 -p 49443:49443 org.saimonmoore/mneme/dht-relay:dev web`

(for production, set NODE_ENV=production as env argument)

## Production certificate

### Creation

See https://blog.zespre.com/lets-encrypt-dns-challenge/

#### Setup

- Log into gandi.com
- Visit User Settings > Personal Access Tokens
- Create gandi api token with `Manage domain name technical configurations` permission

1. `vim /etc/letsencrypt/gandi/gandi.ini`

```
certbot_plugin_gandi:dns_gandi_api_key=REDACTED
```

2. `chmod 400 /etc/letsencrypt/gandi/gandi.ini`

3. Generate initial certificate:

```

```

#### Renewal

See also: https://www.linux.it/~ema/posts/letsencrypt-the-manual-plugin-is-not-working/ 
# fekoneko VPS

Here are all Docker containers that I run on my VPS.

All the services are under _Traefik_ reverse-proxy and use their own dedicated Docker network (`traefik`). I also prefer making dynamic file configs over container labels for Traefik to keep them in one place, clean and readable.

## Available services

### WEB:

- Landing page - `https://$DOMAIN`
- [SearXNG](https://github.com/searxng) - `https://searxng.$DOMAIN`
- [Nextcloud](https://github.com/nextcloud) - `https://nextcloud.$DOMAIN`
- [Wireguard panel](https://github.com/wg-easy/wg-easy) - `https://wireguard.$DOMAIN`
- [Traefik](https://github.com/traefik/traefik) dashboard - `https://traefik.$DOMAIN`
- [Vaultwarden](https://github.com/dani-garcia/vaultwarden) - `https://vaultwarden.$DOMAIN`

### Other:

- [Wireguard VPN](https://github.com/wireguard) - `$DOMAIN:51820/udp`
- Wireguard VPN through [WebSocket tunnel](https://github.com/erebe/wstunnel):

```shell
# This will need a DNS server or cache to be available
wstunnel client -L 'udp://51820:172.20.0.4:51820?timeout_sec=0' wss://wstunnel.$DOMAIN:443

# This will allow to connect directly using IP address
# Preferrable when DNS is done througn WireGuard as well
nohup wstunnel client \
  --local-to-remote udp://51820:172.20.0.4:51820?timeout_sec=0 \
  --tls-verify-certificate \
  --tls-sni-override wstunnel.$DOMAIN \
  --http-headers Host:wstunnel.$DOMAIN \
  wss://$IPV4:443 &
```

- [Drawpile](https://github.com/drawpile/Drawpile) server - `drawpile.$DOMAIN:27750/tcp`
- [Anki](https://github.com/ankitects/anki) sync server - `https://anki.$DOMAIN`

## Before composing containers

- Create the Docker network with the following command:

```shell
docker network create --driver=bridge --subnet=172.20.0.0/16 traefik
```

- Create `.env` files in each container's directory. Use `.env.example` as a reference.

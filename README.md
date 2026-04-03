# fekoneko vps

Here are all Docker containers that I run on my vps.

All the services are under _Traefik_ reverse-proxy and use their own dedicated Docker network (`traefik`). I also prefer making dynamic file configs over container labels for Traefik to keep them in one place, clean and readable.

## Available services

### WEB:

- Landing page - `https://$DOMAIN`
- [SearXNG](https://github.com/searxng) - `https://searxng.$DOMAIN`
- [Nextcloud](https://github.com/nextcloud) - `https://nextcloud.$DOMAIN`
- [Wireguard panel](https://github.com/wg-easy/wg-easy) - `https://wireguard.$DOMAIN`
- [Traefik](https://github.com/traefik/traefik) dashboard - `https://traefik.$DOMAIN`
- [Vaultwarden](https://github.com/dani-garcia/vaultwarden) - `https://vaultwarden.$DOMAIN`
- Video Room - `https://videoroom.$DOMAIN`

### Other:

- [AmneziaWG](https://github.com/wireguard) - `$DOMAIN:51820/udp`
- [Drawpile](https://github.com/drawpile/Drawpile) server - `wss://drawpile.$DOMAIN` | `drawpile.$DOMAIN:27750/tcp`
- [Anki](https://github.com/ankitects/anki) sync server - `https://anki.$DOMAIN`

## Before composing containers

- Create the Docker network with the following command:

```shell
docker network create --driver=bridge --subnet=172.20.0.0/16 traefik
```

- Create `.env` files in each container's directory. Use `.env.example` as a reference.

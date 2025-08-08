# fekoneko VPS

Here are all Docker containers that I run on my VPS.

All the services are under _Traefik_ reverse-proxy and use their own dedicated Docker network (`traefik`). I also prefer making dynamic file configs over container labels for Traefik to keep them in one place, clean and readable.

## Available services

### WEB:

- Landing page - `$DOMAIN`

- SearXNG - `searxng.$DOMAIN`

- Nextcloud - `nextcloud.$DOMAIN`

- Wireguard panel - `wireguard.$DOMAIN`

- Traefik dashboard - `traefik.$DOMAIN`

- Vaultwarden - `vaultwarden.$DOMAIN`

### Other:

- Wireguard VPN - `$DOMAIN:51820/udp`

- Wireguard VPN through WebSocket tunnel:

```shell
wstunnel client -L 'udp://51820:172.20.0.4:51820?timeout_sec=0' wss://wstunnel.$DOMAIN:443
```

## Before composing containers

- Create the Docker network with the following command:

```shell
docker network create --driver=bridge --subnet=172.20.0.0/16 traefik
```

- Create `.env` files in each container's directory. Use `.env.example` as a reference.

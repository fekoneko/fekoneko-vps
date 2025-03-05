# fekoneko VPS

Here are all Docker containers that I run on my VPS.

All the services are under _Traefik_ reverse-proxy and use their own dedicated Docker network (`traefik`). I also prefer making dynamic file configs over container labels for Traefik to keep them in one place, clean and readable.

## Available services

### WEB:
- Landing page - `<main_domain>`
- SearXNG instance - `searxng.<main_domain>`
- Nextcloud instance - `nextcloud.<main_domain>`
- Wireguard panel - `wireguard.<main_domain>`
- Traefik dashboard - `traefik.<main_domain>`

### Other:
- Wireguard VPN - `:51820/udp`

## Before composing containers

- Create the Docker network with the following command:

```shell
docker network create --driver=bridge --subnet=172.20.0.0/16 traefik
```

- Create `.env` files in each container's directory. Use `.env.example` as a reference.

import { DOMAIN } from "@/config/environment";

export interface Service {
  title: string;
  names: string[];
  addresses: ServiceAddress[];
}

export interface ServiceAddress {
  address: string;
  browserAccessible: boolean;
  description: string;
}

export const SERVICES: Service[] = [
  {
    title: "Wireguard",
    names: ["wireguard", "wstunnel"],
    addresses: [
      {
        address: `https://wireguard.${DOMAIN}`,
        browserAccessible: true,
        description: "Admin web UI",
      },
      {
        address: `${DOMAIN}:51820/udp`,
        browserAccessible: false,
        description: "Regular Wireguard connection",
      },
      {
        address: `wss://wstunnel.${DOMAIN}:443`,
        browserAccessible: false,
        description: "Tunneled WebSocket connection",
      },
    ],
  },
  {
    title: "Drawpile Server",
    names: ["drawpile"],
    addresses: [
      {
        address: `wss://drawpile.${DOMAIN}`,
        browserAccessible: false,
        description: "Secure WebSocket connection",
      },
      {
        address: `${DOMAIN}:27750/tcp`,
        browserAccessible: false,
        description: "Regular unencrypted connection",
      },
    ],
  },
  {
    title: "SearXNG",
    names: ["searxng"],
    addresses: [
      {
        address: `https://searxng.${DOMAIN}`,
        browserAccessible: true,
        description: "Web UI",
      },
    ],
  },
  {
    title: "Vaultwarden",
    names: ["vaultwarden"],
    addresses: [
      {
        address: `https://vaultwarden.${DOMAIN}`,
        browserAccessible: true,
        description: "Web UI",
      },
    ],
  },
  {
    title: "Nextcloud",
    names: ["nextcloud"],
    addresses: [
      {
        address: `https://nextcloud.${DOMAIN}`,
        browserAccessible: true,
        description: "Web UI",
      },
    ],
  },
  {
    title: "Anki Sync Server",
    names: ["anki"],
    addresses: [
      {
        address: `https://anki.${DOMAIN}`,
        browserAccessible: false,
        description: "Server URL",
      },
    ],
  },
  {
    title: "Video Lobby",
    names: ["video-lobby"],
    addresses: [
      {
        address: `https://video-lobby.${DOMAIN}`,
        browserAccessible: true,
        description: "Web UI",
      },
    ],
  },
  {
    title: "Traefik Dashboard",
    names: ["traefik"],
    addresses: [
      {
        address: `https://traefik.${DOMAIN}`,
        browserAccessible: true,
        description: "Web UI",
      },
    ],
  },
];

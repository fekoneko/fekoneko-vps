import { ServerWebSocket } from "bun";
import { readdir } from "node:fs/promises";

interface VideoState {
  paused: boolean;
  currentTime: number;
}

const isVideoState = (state: unknown): state is VideoState =>
  state !== null &&
  typeof state === "object" &&
  "paused" in state &&
  typeof state?.paused === "boolean" &&
  "currentTime" in state &&
  typeof state.currentTime === "number" &&
  !Number.isNaN(state.currentTime);

interface Lobby {
  id: string;
  state: VideoState;
  clients: Set<ServerWebSocket>;
}

const lobbyById = new Map<string, Lobby>();
const lobbyByClient = new Map<ServerWebSocket, Lobby>();

const handleJoin = (ws: ServerWebSocket, data: unknown) => {
  const isDataValid = !!data && typeof data === "object" && "lobbyId" in data;
  if (!isDataValid) throw new Error(`Invalid message: ${JSON.stringify(data)}`);
  const { lobbyId } = data;

  if (typeof lobbyId !== "string")
    throw new Error(`Invalid lobby ID: ${lobbyId}`);

  leaveLobby(ws);

  let lobby = lobbyById.get(lobbyId);
  if (!lobby) {
    const state: VideoState = { paused: true, currentTime: 0 };
    lobby = { id: lobbyId, state, clients: new Set() };
    lobbyById.set(lobbyId, lobby);
  }

  lobby.clients.add(ws);
  lobbyByClient.set(ws, lobby);
  sendState(ws, lobby.state);
  lobby.clients.forEach((c) => sendClientCount(c, lobby.clients.size));

  return lobby;
};

const handleSetState = (ws: ServerWebSocket, data: unknown) => {
  const isDataValid =
    !!data && typeof data === "object" && "state" in data && "time" in data;
  if (!isDataValid) throw new Error(`Invalid message: ${JSON.stringify(data)}`);
  const { state, time } = data;

  if (!isVideoState(state))
    throw new Error(`Invalid state: ${JSON.stringify(state)}`);

  if (!time || typeof time !== "number")
    throw new Error(`Invalid time: ${time}`);

  const lobby = lobbyByClient.get(ws);
  if (!lobby) throw new Error("Has not joined a lobby");

  const correctedState: VideoState = { ...state };
  if (correctedState.paused === false)
    correctedState.currentTime += Date.now() - time;

  lobby.state = correctedState;
  lobby.clients.forEach((c) => c !== ws && sendState(c, correctedState));
};

const leaveLobby = (ws: ServerWebSocket) => {
  const lobby = lobbyByClient.get(ws);
  if (!lobby) return;

  lobby.clients.delete(ws);
  lobbyByClient.delete(ws);

  if (!lobby.clients.size) lobbyById.delete(lobby.id);
  else lobby.clients.forEach((c) => sendClientCount(c, lobby.clients.size));
};

const sendState = (ws: ServerWebSocket, state: VideoState) => {
  ws.send(JSON.stringify({ type: "state", state, time: Date.now() }));
};

const sendClientCount = (ws: ServerWebSocket, clientsCount: number) => {
  ws.send(JSON.stringify({ type: "clients", clientsCount }));
};

const fileRoutes: Bun.Serve.Options<undefined, string>["routes"] = {};

for (const path of await readdir("./dist", { recursive: true })) {
  fileRoutes["/" + path] = Bun.file(`./dist/${path}`);
}

const server = Bun.serve({
  port: 3000,

  routes: {
    ...fileRoutes,
    "/": Bun.file("./dist/index.html"),

    "/ws": (req, server) => {
      if (!server.upgrade(req))
        return new Response("Upgrade failed", { status: 500 });
    },

    "/*": Response.redirect("/"),
  },

  websocket: {
    open(ws) {
      console.log(`New WebSocket connection: ${ws.remoteAddress}`);
    },

    message(ws, message) {
      try {
        const data = JSON.parse(message as string);

        if (data?.type === "join") {
          handleJoin(ws, data);
        } else if (data.type === "state") {
          handleSetState(ws, data);
        } else {
          throw new Error("Unknown message type");
        }
      } catch (error) {
        const message = (error as Error)?.message;
        ws.send(JSON.stringify({ type: "error", error: message }));
      }
    },

    close(ws, code, message) {
      console.log(
        `WebSocket connection closed: ${ws.remoteAddress}, code: ${code}, message: ${message}`,
      );
      leaveLobby(ws);
    },
  },
});

console.log(`Server running at ${server.url}`);

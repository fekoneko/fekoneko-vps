import { ServerWebSocket } from "bun";
import { readdir } from "node:fs/promises";

interface PlayerState {
  paused: boolean;
  currentTime: number;
}

const isPlayerState = (state: unknown): state is PlayerState =>
  state !== null &&
  typeof state === "object" &&
  "paused" in state &&
  typeof state?.paused === "boolean" &&
  "currentTime" in state &&
  typeof state.currentTime === "number" &&
  !Number.isNaN(state.currentTime);

interface Room {
  id: string;
  state: PlayerState;
  clients: Set<ServerWebSocket>;
}

const roomById = new Map<string, Room>();
const roomByClient = new Map<ServerWebSocket, Room>();

const handleJoin = (ws: ServerWebSocket, data: unknown) => {
  const isDataValid = !!data && typeof data === "object" && "roomId" in data;
  if (!isDataValid) throw new Error(`Invalid message: ${JSON.stringify(data)}`);
  const { roomId } = data;

  if (typeof roomId !== "string") throw new Error(`Invalid room ID: ${roomId}`);

  leaveRoom(ws);

  let room = roomById.get(roomId);
  if (!room) {
    const state: PlayerState = { paused: true, currentTime: 0 };
    room = { id: roomId, state, clients: new Set() };
    roomById.set(roomId, room);
  }

  room.clients.add(ws);
  roomByClient.set(ws, room);
  sendState(ws, room.state);
  room.clients.forEach((c) => sendClientCount(c, room.clients.size));

  return room;
};

const handleSetState = (ws: ServerWebSocket, data: unknown) => {
  const isDataValid =
    !!data && typeof data === "object" && "state" in data && "time" in data;
  if (!isDataValid) throw new Error(`Invalid message: ${JSON.stringify(data)}`);
  const { state, time } = data;

  if (!isPlayerState(state))
    throw new Error(`Invalid state: ${JSON.stringify(state)}`);

  if (!time || typeof time !== "number")
    throw new Error(`Invalid time: ${time}`);

  const room = roomByClient.get(ws);
  if (!room) throw new Error("Has not joined a room");

  const correctedState: PlayerState = { ...state };
  if (correctedState.paused === false)
    correctedState.currentTime += Date.now() - time;

  room.state = correctedState;
  room.clients.forEach((c) => c !== ws && sendState(c, correctedState));
};

const leaveRoom = (ws: ServerWebSocket) => {
  const room = roomByClient.get(ws);
  if (!room) return;

  room.clients.delete(ws);
  roomByClient.delete(ws);

  if (!room.clients.size) roomById.delete(room.id);
  else room.clients.forEach((c) => sendClientCount(c, room.clients.size));
};

const sendState = (ws: ServerWebSocket, state: PlayerState) => {
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
      leaveRoom(ws);
    },
  },
});

console.log(`Server running at ${server.url}`);

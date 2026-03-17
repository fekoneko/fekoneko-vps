import { WS_URL } from "@/config/environment";
import { useWebSocket } from "@/hooks/use-web-socket";

export interface PlayerState {
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

export interface UsePlayerApiConfig {
  roomId: string;
  onStateReceived?: (state: () => PlayerState) => void | Promise<void>;
  onClientsCountReceived?: (clientsCount: number) => void | Promise<void>;
}

export const usePlayerApi = (config: UsePlayerApiConfig) => {
  const { status, send, useOnConnected, useOnMessage } = useWebSocket(WS_URL);

  useOnConnected(
    () => send(JSON.stringify({ type: "join", roomId: config.roomId })),
    [config.roomId],
  );

  useOnMessage(
    ({ data: rawData }) => {
      const data = JSON.parse(rawData);

      if (data?.type === "state") {
        if (!isPlayerState(data.state))
          throw new Error(`Invalid state: ${JSON.stringify(data.state)}`);

        if (!data.time || typeof data.time !== "number")
          throw new Error(`Invalid time: ${data.time}`);

        config.onStateReceived?.(() => {
          const correctedState: PlayerState = { ...data.state };
          if (correctedState.paused === false)
            correctedState.currentTime += Date.now() - data.time;

          return correctedState;
        });
      } else if (data.type === "clients") {
        if (
          typeof data.clientsCount !== "number" ||
          Number.isNaN(data.clientsCount)
        )
          throw new Error(
            `Invalid clients count: ${JSON.stringify(data.clientsCount)}`,
          );

        config.onClientsCountReceived?.(data.clientsCount);
      } else if (data.type === "error") {
        throw new Error(`Server returned an error: ${data.error}`);
      } else {
        throw new Error(`Unknown message type: ${data?.type}`);
      }
    },
    [config],
  );

  const sendState = (state: PlayerState) =>
    send(JSON.stringify({ type: "state", state, time: Date.now() }));

  return { status, sendState };
};

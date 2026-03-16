import { WS_URL } from "@/config/environment";
import { useEffect } from "react";

export interface VideoState {
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

export interface UseVideoWsConfig {
  lobbyId: string;
  onStateReceived?: (state: () => VideoState) => void | Promise<void>;
  onClientsCountReceived?: (clientsCount: number) => void | Promise<void>;
}

export interface UseVideoWsReturn {
  sendState: (state: VideoState) => void;
}

const WS = new WebSocket(WS_URL);

export const useWebSocket = (config: UseVideoWsConfig): UseVideoWsReturn => {
  useEffect(
    () => WS.send(JSON.stringify({ type: "join", lobbyId: config.lobbyId })),
    [config.lobbyId],
  );

  useEffect(() => {
    const handleMessage = ({ data: rawData }: MessageEvent<string>) => {
      const data = JSON.parse(rawData);

      if (data?.type === "state") {
        if (!isVideoState(data.state))
          throw new Error(`Invalid state: ${JSON.stringify(data.state)}`);

        if (!data.time || typeof data.time !== "number")
          throw new Error(`Invalid time: ${data.time}`);

        config.onStateReceived?.(() => {
          const correctedState: VideoState = { ...data.state };
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
    };
    WS.addEventListener("message", handleMessage);

    return () => WS.removeEventListener("message", handleMessage);
  }, [config]);

  const sendState = (state: VideoState) => {
    WS.send(JSON.stringify({ type: "state", state, time: Date.now() }));
  };

  return { sendState };
};

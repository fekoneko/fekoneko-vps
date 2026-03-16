import { WS_URL } from "@/config/environment";
import { useEffect, useRef } from "react";

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

export const useWebSocket = (config: UseVideoWsConfig): UseVideoWsReturn => {
  const wsRef = useRef<WebSocket | null>(null);

  const getWs = () => {
    if (wsRef.current === null) wsRef.current = new WebSocket(WS_URL);
    return wsRef.current;
  };

  const waitWsOpen = async () => {
    const ws = getWs();

    if (ws.readyState === WebSocket.CONNECTING)
      await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve);
        ws.addEventListener("error", reject);
      });
    else if (ws.readyState !== WebSocket.OPEN)
      throw new Error(`WebSocket status is ${ws.readyState}`);

    return ws;
  };

  useEffect(() => {
    const send = async () => {
      const ws = await waitWsOpen();
      ws.send(JSON.stringify({ type: "join", lobbyId: config.lobbyId }));
    };
    send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.lobbyId]);

  useEffect(() => {
    const ws = getWs();

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
    ws.addEventListener("message", handleMessage);

    return () => ws.removeEventListener("message", handleMessage);
  }, [config]);

  const sendState = (state: VideoState) => {
    const send = async () => {
      const ws = await waitWsOpen();
      ws.send(JSON.stringify({ type: "state", state, time: Date.now() }));
    };
    send();
  };

  return { sendState };
};

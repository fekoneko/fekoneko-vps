import { WS_URL } from "@/config/environment";
import { useEffect, useRef, useState } from "react";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

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

export interface UsePlayerApiReturn {
  sendState: (state: PlayerState) => void;
  connectionStatus: ConnectionStatus;
}

export const usePlayerApi = (
  config: UsePlayerApiConfig,
): UsePlayerApiReturn => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);

  const getWs = () => {
    if (!wsRef.current) connect();
    return wsRef.current!;
  };

  const connect = () => {
    wsRef.current?.close();
    wsRef.current = new WebSocket(WS_URL);

    const handleConnected = () => {
      setConnectionStatus("connected");
    };

    const handleDisconnected = () => {
      setConnectionStatus("disconnected");
      wsRef.current = null;
    };

    setConnectionStatus("connecting");
    wsRef.current.addEventListener("open", handleConnected, { once: true });
    wsRef.current.addEventListener("error", handleDisconnected, { once: true });
    wsRef.current.addEventListener("close", handleDisconnected, { once: true });
  };

  const waitConnected = async () => {
    const ws = getWs();

    if (ws.readyState === WebSocket.CONNECTING)
      await new Promise((resolve, reject) => {
        const resolveAndCleanup = () => {
          resolve(undefined);
          ws.removeEventListener("error", rejectAndCleanup);
        };
        ws.addEventListener("open", resolveAndCleanup, { once: true });

        const rejectAndCleanup = () => {
          reject(new Error("WebSocket connection failed"));
          ws.removeEventListener("open", resolveAndCleanup);
        };
        ws.addEventListener("error", rejectAndCleanup, { once: true });
      });
    else if (ws.readyState !== WebSocket.OPEN)
      throw new Error(`WebSocket status is ${ws.readyState}`);

    return ws;
  };

  useEffect(() => {
    const send = async () => {
      const ws = await waitConnected();
      ws.send(JSON.stringify({ type: "join", roomId: config.roomId }));
    };
    send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.roomId]);

  useEffect(() => {
    const ws = getWs();

    const handleMessage = ({ data: rawData }: MessageEvent<string>) => {
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
    };
    ws.addEventListener("message", handleMessage);

    return () => ws.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const sendState = (state: PlayerState) => {
    const send = async () => {
      const ws = await waitConnected();
      ws.send(JSON.stringify({ type: "state", state, time: Date.now() }));
    };
    send();
  };

  return { sendState, connectionStatus };
};

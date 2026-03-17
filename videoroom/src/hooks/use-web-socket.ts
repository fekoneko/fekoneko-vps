import { DependencyList, useEffect, useRef, useState } from "react";

export type WebSocketStatus = "connecting" | "connected" | "disconnected";

export const useWebSocket = (url: string, protocols?: string | string[]) => {
  const [status, setStatus] = useState<WebSocketStatus>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const openedSubscribersRef = useRef<Set<(ws: WebSocket) => void>>(new Set());
  const messageSubscribersRef = useRef<Set<(e: MessageEvent) => void>>(
    new Set(),
  );

  useEffect(() => {
    const controller = new AbortController();
    let ws: WebSocket;

    const retryUntilOpen = async () => {
      if (controller.signal.aborted) return;

      ws = new WebSocket(url, protocols);
      wsRef.current = ws;
      setStatus("connecting");

      const handleOpen = () => {
        if (controller.signal.aborted) return;
        openedSubscribersRef.current.forEach((subscriber) => subscriber(ws!));
        setStatus("connected");
      };

      const handleClose = () => {
        if (controller.signal.aborted) return;
        ws.removeEventListener("open", handleOpen);
        ws.removeEventListener("close", handleClose);
        ws.removeEventListener("message", handleMessage);
        setTimeout(retryUntilOpen, 3000);
        setStatus("disconnected");
      };

      const handleMessage = (e: MessageEvent) => {
        if (controller.signal.aborted) return;
        messageSubscribersRef.current.forEach((subscriber) => subscriber(e));
      };

      ws.addEventListener("open", handleOpen, { once: true });
      ws.addEventListener("close", handleClose, { once: true });
      ws.addEventListener("message", handleMessage);
    };
    retryUntilOpen();

    return () => {
      ws?.close();
      controller.abort();
      setStatus("disconnected");
    };
  }, [url, protocols]);

  const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      return wsRef.current.send(data);

    const handleConnected = (ws: WebSocket) => {
      ws.send(data);
      openedSubscribersRef.current.delete(handleConnected);
    };
    subscribeConnected(handleConnected);
  };

  const subscribeConnected = (subscriber: (ws: WebSocket) => void) => {
    openedSubscribersRef.current.add(subscriber);
    return () => void openedSubscribersRef.current.delete(subscriber);
  };

  const subscribeMessage = (subscriber: (e: MessageEvent) => void) => {
    messageSubscribersRef.current.add(subscriber);
    return () => void messageSubscribersRef.current.delete(subscriber);
  };

  const useOnConnected = (
    subscriber: (ws: WebSocket) => void,
    deps?: DependencyList,
  ) =>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => subscribeConnected(subscriber), deps);

  const useOnMessage = (
    subscriber: (e: MessageEvent) => void,
    deps?: DependencyList,
  ) =>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => subscribeMessage(subscriber), deps);

  return { status, send, useOnConnected, useOnMessage };
};

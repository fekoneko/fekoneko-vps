import { useWebSocket, VideoState } from "@/hooks/use-web-socket";
import { FC, useEffect, useRef, useState } from "react";
import classes from "./video-player.module.css";

export const VideoPlayer: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [roomId, setRoomId] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [clientsCount, setClientsCount] = useState<number>(1);
  const sentStateRef = useRef<VideoState | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoading = () => setIsVideoLoading(true);
    video.addEventListener("loadstart", handleLoading);
    const handleLoaded = () => setIsVideoLoading(false);
    video.addEventListener("loadeddata", handleLoaded);

    return () => {
      video.removeEventListener("loadstart", handleLoading);
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  const { sendState } = useWebSocket({
    roomId,
    onStateReceived: async (getState) => {
      const video = videoRef.current;
      if (!video) return;

      const updateState = () => {
        const state = getState();
        video.currentTime = state.currentTime / 1000;
        if (state.paused) video.pause();
        else video.play();
        sentStateRef.current = state;
      };
      updateState();

      if (isVideoLoading)
        video.addEventListener("loadeddata", updateState, { once: true });
    },
    onClientsCountReceived: setClientsCount,
  });

  const handleStateChange = () => {
    const video = videoRef.current;
    const sentState = sentStateRef.current;
    if (!video) return;

    const state = {
      paused: video.paused,
      currentTime: video.currentTime * 1000,
    };

    const isSentState =
      sentState?.paused === state.paused &&
      sentState?.currentTime === state.currentTime;

    if (!isSentState) sendState(state);
  };

  return (
    <section className={classes.container}>
      <video
        ref={videoRef}
        controls
        onPlay={handleStateChange}
        onPause={handleStateChange}
        onSeeking={handleStateChange}
        className={classes.video}
      >
        {file && <source src={URL.createObjectURL(file)} type="video/mp4" />}
      </video>

      <form onSubmit={(e) => e.preventDefault()} className={classes.controls}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={classes.fileControl}
        >
          <span>{file ? file.name : "Choose a video"}</span>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ display: "none" }}
          />
        </button>

        <div className={classes.roomControls}>
          <label className={classes.roomIdControl}>
            <span>Room ID:</span>

            <input
              type="text"
              placeholder="Paste existing to join or make your own"
              onChange={(e) => setRoomId(e.target.value)}
            />
          </label>

          <div className={classes.clientsCount}>
            <span>Clients:</span>
            <span>{clientsCount}</span>
          </div>
        </div>
      </form>
    </section>
  );
};

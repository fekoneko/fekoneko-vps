import { PlayerState, usePlayerApi } from "@/hooks/use-player-api";
import { ChangeEventHandler, FC, useEffect, useRef, useState } from "react";
import classes from "./video-player.module.css";

export const VideoPlayer: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sentStateRef = useRef<PlayerState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>();
  const [videoName, setVideoName] = useState<string>();
  const [roomId, setRoomId] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [clientsCount, setClientsCount] = useState<number>(1);

  const { sendState, status } = usePlayerApi({
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
  }, [videoSrc]);

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

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoSrc(URL.createObjectURL(file));
    setVideoName(file.name);
  };

  const handleRoomIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const roomId = e.target.value;
    setRoomId(roomId);
  };

  return (
    <section className={classes.container}>
      <p className={classes.connectionStatus} data-status={status}>
        {status}
      </p>

      <video
        ref={videoRef}
        src={videoSrc}
        controls
        onPlay={handleStateChange}
        onPause={handleStateChange}
        onSeeking={handleStateChange}
        className={classes.video}
      />

      <form onSubmit={(e) => e.preventDefault()} className={classes.controls}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={classes.fileControl}
        >
          <span>{videoName ?? "Choose a video"}</span>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </button>

        <div className={classes.roomControls}>
          <label className={classes.roomIdControl}>
            <span>Room ID:</span>

            <input
              type="text"
              placeholder="Paste existing to join or make your own"
              value={roomId}
              onChange={handleRoomIdChange}
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

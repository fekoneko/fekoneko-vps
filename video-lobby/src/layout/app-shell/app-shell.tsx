import { VideoPlayer } from "@/components/video-player";
import { Header } from "@/layout/header";
import { FC } from "react";
import classes from "./app-shell.module.css";

export const AppShell: FC = () => (
  <div className={classes.layout}>
    <Header />

    <main className={classes.main}>
      <VideoPlayer />
    </main>
  </div>
);

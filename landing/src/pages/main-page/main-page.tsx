import avatarSrc from "@/assets/avatar.jpg";
import { FC } from "react";
import classes from "./main-page.module.css";

export const MainPage: FC = () => (
  <div className={classes.page}>
    <figure className={classes.avatarFigure}>
      <img
        src={avatarSrc}
        alt="fekoneko avatar"
        className={classes.avatarImage}
      />
      <figcaption className={classes.avatarCaption}>fekoneko</figcaption>
    </figure>
  </div>
);

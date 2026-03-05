import avatarSrc from "@/assets/avatar.jpg";
import { FC } from "react";
import classes from "./main-page.module.css";

export const AboutSection: FC = () => (
  <section className={classes.aboutSection}>
    <figure className={classes.avatarFigure}>
      <img
        src={avatarSrc}
        alt="fekoneko avatar"
        className={classes.avatarImage}
      />

      <div className={classes.avatarInfo}>
        <figcaption className={classes.avatarNickname}>fekoneko</figcaption>

        <p className={classes.avatarSlogan}>
          An impostor in IT who dislikes AI
        </p>
      </div>
    </figure>

    <h2 className={classes.rightText}>Services</h2>
  </section>
);

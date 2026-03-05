import { FC } from "react";
import classes from "./header.module.css";

export const Header: FC = () => (
  <header className={classes.header}>
    <h1 role="banner" className={classes.title}>
      fekoneko VPS
    </h1>
  </header>
);

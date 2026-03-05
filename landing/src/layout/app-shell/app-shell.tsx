import { Header } from "@/layout/header";
import { MainPage } from "@/pages/main-page";
import { FC } from "react";
import classes from "./app-shell.module.css";

export const App: FC = () => (
  <div>
    <Header />

    <main className={classes.main}>
      <MainPage />
    </main>
  </div>
);

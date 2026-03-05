import { Header } from "@/layout/header";
import { MainPage } from "@/pages/main-page";
import { FC } from "react";

export const App: FC = () => (
  <div>
    <Header />

    <main>
      <MainPage />
    </main>
  </div>
);

import { AboutSection } from "@/pages/main-page/about-section";
import { ServicesSection } from "@/pages/main-page/services-section";
import { FC } from "react";
import classes from "./main-page.module.css";

export const MainPage: FC = () => (
  <div className={classes.page}>
    <AboutSection />
    <ServicesSection />
  </div>
);

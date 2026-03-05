import { SOCIAL_LINKS } from "@/config/environment";
import { FC, useEffect, useState } from "react";
import classes from "./header.module.css";

export const Header: FC = () => {
  const [withShadow, setWithShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setWithShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={classes.header} data-with-shadow={withShadow}>
      <div className={classes.inner}>
        <h1 role="banner" className={classes.title}>
          fekoneko VPS
        </h1>

        <nav>
          <ul className={classes.socialLinksList}>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={href} className={classes.socialLinkItem}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialLink}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

import { SERVICES } from "@/config/services";
import { FC } from "react";
import classes from "./main-page.module.css";

export const ServicesSection: FC = () => (
  <section className={classes.servicesSection}>
    {SERVICES.map(({ title, names, addresses }) => (
      <div key={title} className={classes.serviceCard}>
        <div className={classes.serviceCardHeader}>
          <h3 className={classes.serviceTitle}>{title}</h3>

          <ul className={classes.serviceNamesList}>
            {names.map((name) => (
              <li key={name} className={classes.serviceName}>
                {name}
              </li>
            ))}
          </ul>
        </div>

        <ul className={classes.serviceAddressesList}>
          {addresses.map(({ address, browserAccessible, description }) => {
            const Link = browserAccessible ? "a" : "span";

            return (
              <li key={address} className={classes.serviceAddress}>
                <Link
                  href={address}
                  className={classes.serviceAddressLink}
                  data-browser-accessible={browserAccessible}
                >
                  {address}
                </Link>

                <p className={classes.serviceAddressDescription}>
                  {description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </section>
);

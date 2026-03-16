export interface SocialLink {
  label: string;
  href: string;
}

const getEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`${key} environment variable is not set`);
  return value;
};

export const WS_URL = getEnv("VITE_WS_URL");

export const SOCIAL_LINKS = Object.entries<string>(
  JSON.parse(getEnv("VITE_SOCIAL_LINKS")),
).map<SocialLink>(([label, href]) => ({ label, href }));

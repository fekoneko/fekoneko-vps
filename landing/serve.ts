import { readdir } from "node:fs/promises";

const fileRoutes: Bun.Serve.Options<undefined, string>["routes"] = {};

for (const path of await readdir("./dist", { recursive: true })) {
  fileRoutes["/" + path] = Bun.file(`./dist/${path}`);
}

const server = Bun.serve({
  port: 3000,
  routes: {
    ...fileRoutes,
    "/": Bun.file("./dist/index.html"),
    "/*": Response.redirect("/"),
  },
});

console.log(`Server running at ${server.url}`);

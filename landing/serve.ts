const server = Bun.serve({
  port: 3000,
  routes: {},
});

console.log(`Server running at ${server.url}`);

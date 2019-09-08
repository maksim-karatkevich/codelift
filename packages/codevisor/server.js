const { createServer } = require("http");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const dir = __dirname;
const { PORT = 1337 } = process.env;

const app = next({ dev, dir });

createServer(app.getRequestHandler()).listen(PORT, err => {
  if (err) throw err;

  console.log(`> codevisor started on http://localhost:${PORT}`);

  app.prepare();
});

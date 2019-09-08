const { createServer } = require("http");
const next = require("next");
const open = require("open");

const dev = process.env.NODE_ENV !== "production";
const dir = __dirname;
const { PORT = 1337 } = process.env;

const app = next({ dev, dir });

createServer(app.getRequestHandler()).listen(PORT, err => {
  if (err) throw err;

  const url = `http://localhost:${PORT}`;

  console.log(`> codevisor started on ${url}`);
  open(url);

  app.prepare();
});

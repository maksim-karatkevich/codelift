const { createServer } = require("http");
const next = require("next");
const open = require("open");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const dir = __dirname;
const { PORT = 1337 } = process.env;

const app = next({ dev, dir });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/api") {
        handle(req, res);
      } else {
        app.render(req, res, "/", query);
      }
    }).listen(PORT, err => {
      if (err) throw err;

      const url = `http://localhost:${PORT}`;

      console.log(`> codevisor started on ${url}`);
      open(url);
    });
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

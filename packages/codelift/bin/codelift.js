#!/usr/bin/env node

const { spawn } = require("child_process");
const waitForLocalhost = require("wait-for-localhost");

const [, , ...args] = process.argv;
// TODO Use npm if package-lock.json exists
const command = "yarn";

(async () => {
  // Start subprocess
  spawn(command, args.length ? args : ["start"], {
    stdio: "inherit"
  });

  // Wait until the server is listening
  console.log(`☁️  codelift waiting on localhost:3000...`);
  await waitForLocalhost({ port: 3000 });

  // Start codelift
  require("../server");
})();

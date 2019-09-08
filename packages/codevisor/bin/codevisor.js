#!/usr/bin/env node

const { spawn } = require("child_process");
const [, , command, ...args] = process.argv;

// Start subprocess
spawn(command ? command : "yarn", command ? args : ["start"], {
  stdio: "inherit"
});

require("../server");

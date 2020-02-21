const env = require("./env");

module.exports = function inspect(Component, Inspector) {
  if (!env.React) {
    throw new Error(
      `React was not passed to codelift's register(...) function`
    );
  }

  if (!env.ReactDOM) {
    throw new Error(
      `ReactDOM was not passed to codelift's register(...) function`
    );
  }

  Inspector["React"] = env.React;
  Inspector["ReactDOM"] = env.ReactDOM;
  Component["Inspector"] = Inspector;
};

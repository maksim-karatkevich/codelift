const withCSS = require("@zeit/next-css");
const { version } = require("./package.json");

module.exports = withCSS({
  generateBuildId() {
    return version;
  }
});

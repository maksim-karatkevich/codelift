const { version } = require("./package.json");

module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  generateBuildId() {
    return version;
  },
};

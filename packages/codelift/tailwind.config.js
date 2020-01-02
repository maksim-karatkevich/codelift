const defaultConfig = require("tailwindcss/defaultConfig");

module.exports = {
  variants: {
    zIndex: defaultConfig.variants.zIndex.concat("hover")
  }
};

const isDev =
  process.env.NODE_ENV === "development" && typeof window === "object";

module.exports.register = isDev ? require("./register") : (arg) => arg;

module.exports.useInspector = isDev
  ? require("./useInspector")
  : (props) => [null /* ref */, props];

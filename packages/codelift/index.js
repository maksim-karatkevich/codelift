module.exports.inspect = (Component, { Inspector }) => {
  Component.Inspector = Inspector;

  return Component;
};

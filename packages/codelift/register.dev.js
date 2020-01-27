// Allow access from GUI on another port
document.domain = window.location.hostname;

const syncPath = () => {
  const store = window["__CODELIFT__"];

  if (store) {
    // Sync path after after other Next listeners have fired
    setTimeout(store.syncPath, 0);
  }
};
// Intercept history methods that don't have a listener
["pushState", "replaceState"].forEach(method => {
  const original = window.history[method];

  window.history[method] = (...args) => {
    original.apply(window.history, args);
    syncPath();
  };
});

window.addEventListener("popstate", syncPath);

if (module.hot) {
  module.hot.addStatusHandler(status => {
    const store = window["__CODELIFT__"];

    if (store) {
      store.handleStatus(status);
    }
  });
}

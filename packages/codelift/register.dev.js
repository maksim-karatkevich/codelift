// Allow access from GUI on another port
document.domain = window.location.hostname;

const { pushState, replaceState } = window.history;

const syncPath = () => {
  const store = window["__CODELIFT__"];

  if (store) {
    setTimeout(store.syncPath, 0);
  }
};

window.history.pushState = (...args) => {
  pushState.apply(window.history, args);
  syncPath();
};

window.history.replaceState = (...args) => {
  replaceState.apply(window.history, args);
  syncPath();
};

window.addEventListener("popstate", syncPath);

if (module.hot) {
  module.hot.addStatusHandler(status => {
    const store = window["__CODELIFT__"];

    if (store) {
      store.handleStatus(status);
    }
  });
}

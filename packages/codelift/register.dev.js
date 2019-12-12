// Allow access from GUI on another port
document.domain = window.location.hostname;

if (module.hot) {
  module.hot.addStatusHandler(status => {
    const store = window["__CODELIFT__"];

    if (store) {
      store.handleStatus(status);
    }
  });
}

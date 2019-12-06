// Allow access from GUI on another port
document.domain = window.location.hostname;

if (module.hot) {
  module.hot.addStatusHandler(status => {
    window["__CODELIFT__"].handleStatus(status);
  });
}

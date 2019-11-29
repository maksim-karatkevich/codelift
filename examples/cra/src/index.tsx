import React from "react";
import ReactDOM from "react-dom";

import "tailwindcss/dist/tailwind.css";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

if (process.env.NODE_ENV === "development" && typeof window === "object") {
  // Allow access from GUI on another port
  document.domain = window.location.hostname;
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

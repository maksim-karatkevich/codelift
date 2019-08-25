import React from "react";
import ReactDOM from "react-dom";

import "tailwindcss/dist/tailwind.css";

import * as serviceWorker from "./serviceWorker";

// Allow access from GUI on another port
if (process.env.NODE_ENV === "development") {
  document.domain = window.location.hostname;
}

ReactDOM.render(
  <span />,
  document.body.appendChild(document.createElement("div"))
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

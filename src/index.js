import React from "react";
import ReactDOM from "react-dom";

import { App } from "./components/App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <App
    defaultEnabled={true}
    defaultTarget={document.querySelector("form button")}
    root={document.querySelector("#root")}
  />,
  document.body.appendChild(document.createElement("div"))
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

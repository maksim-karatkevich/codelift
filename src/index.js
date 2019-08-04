import React from "react";
import ReactDOM from "react-dom";

import { Inspector } from "./components/Inspector/";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Inspector root={document.getElementById("root")} />,
  document.body.appendChild(document.createElement("div"))
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

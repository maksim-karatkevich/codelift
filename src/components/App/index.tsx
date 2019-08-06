import React, { FunctionComponent, useContext, useEffect } from "react";

import { AppStore } from "./AppStore";
import { Inspector } from "../Inspector";

const store = AppStore.create({
  isEnabled: true,
  rootSelector: "#root",
  targetSelector: "form button"
});

export const AppContext = React.createContext(store);

export const useStore = () => {
  return useContext(AppContext);
};

export const App: FunctionComponent = () => {
  useEffect(() => {
    window.addEventListener("keydown", store.handleKeyPress);

    return () => window.removeEventListener("keydown", store.handleKeyPress);
  }, []);

  return (
    <AppContext.Provider value={store}>
      <Inspector />
    </AppContext.Provider>
  );
};

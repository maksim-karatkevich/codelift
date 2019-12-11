import { createContext, useContext } from "react";
import { observer } from "mobx-react-lite";

import { App } from "./models/App";

export { observer };
export const StoreContext = createContext(App.create());
export const useStore = () => useContext(StoreContext);

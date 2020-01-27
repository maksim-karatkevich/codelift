import { createContext, useContext } from "react";
import { observer } from "mobx-react-lite";

import { App } from "./models/App";

const store = App.create();

export { observer };
export const StoreContext = createContext(store);
export const useStore = () => useContext(StoreContext);

import { types } from "mobx-state-tree";
import { createContext, useContext, SyntheticEvent } from "react";

export { observer } from "mobx-react-lite";

export const Store = types
  .model("Store", {
    isTargetLocked: false,
    query: ""
  })
  .volatile(self => ({
    iframe: undefined as undefined | HTMLIFrameElement,
    target: undefined as undefined | HTMLElement
  }))
  .views(self => ({
    get root() {
      if (self.iframe) {
        // Required to access contentWindow
        document.domain = "localhost";

        if (self.iframe.contentWindow) {
          return self.iframe.contentWindow.document.querySelector("body");
        }

        // throw new Error(`Could not access iframe.contentWindow`);
      }

      return undefined;
    }
  }))
  .actions(self => ({
    handleEscape() {
      if (self.isTargetLocked) {
        self.isTargetLocked = false;
      } else {
        self.target = undefined;
      }
    },

    handleFrameLoad(event: SyntheticEvent) {
      if (!(event.target instanceof HTMLIFrameElement)) {
        throw new Error(`handleLoad expected an iFrame`);
      }

      self.iframe = event.target;
    },

    handleTargetHover(target: HTMLElement) {
      if (!self.isTargetLocked) {
        self.target = target;
      }
    },

    handleTargetSelect(target: HTMLElement) {
      self.isTargetLocked = true;
    },

    resetQuery() {
      self.query = "";
    },

    setQuery(value: string) {
      self.query = value;
    },

    unlockTarget() {
      self.isTargetLocked = false;
    }
  }));

export const StoreContext = createContext(Store.create());

export const useStore = () => useContext(StoreContext);

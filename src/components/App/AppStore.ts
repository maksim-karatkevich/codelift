import { types } from "mobx-state-tree";
import unique from "unique-selector";

export const AppStore = types
  .model("App", {
    isEnabled: false,
    rootSelector: types.string,
    targetSelector: types.maybe(types.string)
  })
  .views(self => ({
    get root(): HTMLElement {
      return document.querySelector(self.rootSelector) as HTMLElement;
    },

    get target(): HTMLElement | null {
      if (self.targetSelector) {
        return document.querySelector(self.targetSelector);
      }

      return null;
    }
  }))
  .actions(self => ({
    disable() {
      self.isEnabled = false;
    },

    enable() {
      self.isEnabled = true;
    },

    handleKeyPress(event: KeyboardEvent) {
      const { key } = event;

      if (key === "/" && !self.isEnabled) {
        event.preventDefault();
        this.enable();
      }

      if (key === "Escape") {
        self.target ? this.setTarget() : this.disable();
      }
    },

    setTarget(element?: HTMLElement) {
      self.targetSelector = element ? unique(element) : undefined;
    }
  }));

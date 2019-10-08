import { Instance, types } from "mobx-state-tree";

import { TailwindRule } from "./TailwindRule";

export const Target = types
  .model("Target", {
    isLocked: false
  })
  .volatile(self => ({
    element: undefined as undefined | HTMLElement
  }))
  .views(self => ({
    hasRule(rule: Instance<typeof TailwindRule>) {
      if (!self.element) {
        return false;
      }

      return self.element.classList.contains(rule.className);
    }
  }))
  .actions(self => ({
    lock() {
      self.isLocked = true;
    },

    set(element: HTMLElement) {
      self.element = element;
    },

    unlock() {
      self.isLocked = false;
    },

    unset() {
      self.element = undefined;
    }
  }));

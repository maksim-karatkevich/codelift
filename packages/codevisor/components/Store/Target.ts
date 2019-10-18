import { Instance, types } from "mobx-state-tree";

import { TailwindRule } from "./TailwindRule";

type Rule = Instance<typeof TailwindRule>;

export const Target = types
  .model("Target", {
    classNames: types.array(types.string),
    isLocked: false
  })
  .volatile(self => ({
    element: undefined as undefined | HTMLElement
  }))
  .views(self => ({
    get debugSource() {
      if (!this.reactElement) {
        return undefined;
      }

      if (!this.reactElement._debugSource) {
        throw new Error(`Selected element is missing _debugSource property`);
      }

      return this.reactElement._debugSource;
    },

    hasRule(rule: Rule) {
      if (!self.element) {
        return false;
      }

      return self.classNames.includes(rule.className);
    },

    get reactElement() {
      if (!self.element) {
        return undefined;
      }

      for (const key in self.element) {
        if (key.startsWith("__reactInternalInstance$")) {
          // @ts-ignore
          return self.element[key];
        }
      }
    }
  }))
  .actions(self => ({
    applyRule(rule: Rule) {
      if (self.element) {
        if (self.hasRule(rule)) {
          self.element.classList.remove(rule.className);
        } else {
          self.element.classList.add(rule.className);
        }

        self.classNames.replace([...self.element.classList]);
      }
    },

    cancelRule(rule: Rule) {
      if (self.element) {
        self.element.className = self.classNames.join(" ");
      }
    },

    lock() {
      self.isLocked = true;
    },

    previewRule(rule: Rule) {
      if (self.element) {
        if (self.hasRule(rule)) {
          self.element.classList.remove(rule.className);
        } else {
          self.element.classList.add(rule.className);
        }
      }
    },

    set(element: HTMLElement) {
      self.classNames.replace([...element.classList]);
      self.element = element;
    },

    unlock() {
      self.isLocked = false;
    },

    unset() {
      self.element = undefined;
      self.isLocked = false;
    }
  }));

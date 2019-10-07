import { getEnv, getRoot, types } from "mobx-state-tree";

import { classNameGroups } from "./classNameGroups";

export const TailwindRule = types
  .model("TailwindRule", {
    cssText: types.string,
    selectorText: types.string,
    style: types.frozen()
  })
  .views(self => ({
    get className() {
      return self.selectorText
        .slice(1)
        .split("\\/")
        .join("/");
    },

    get group() {
      for (const pattern in classNameGroups) {
        if (this.className.startsWith(pattern)) {
          return classNameGroups[pattern];
        }
      }

      return "Other";
    },

    get isApplied() {
      const { target } = getEnv(self).parent;

      if (!target) {
        return false;
      }

      return [...target.classList].includes(this.className);
    },

    get isMatching() {
      const { query } = getEnv(self).parent;

      if (!query) {
        return true;
      }

      return this.className.startsWith(query);
    }
  }));

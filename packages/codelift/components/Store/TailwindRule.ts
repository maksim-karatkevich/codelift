import { getRoot, types } from "mobx-state-tree";

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
      const { target } = getRoot(self);

      return target.hasRule(this);
    },

    get isMatching() {
      const { query } = getRoot(self);

      if (!query) {
        return true;
      }

      return this.className.startsWith(query);
    }
  }));

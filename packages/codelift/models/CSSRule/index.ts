import { Instance, getRoot, types } from "mobx-state-tree";
import { classNameGroups } from "./classNameGroups";

import { IApp } from "../App";

export interface ICSSRule extends Instance<typeof CSSRule> {}

export const CSSRule = types
  .model("CSSRule", {
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

    get isApplied(): boolean {
      if (!this.store.target) {
        return false;
      }

      return this.store.target.hasRule(this as ICSSRule);
    },

    get isMatching(): boolean {
      const { query } = this.store;

      if (!this.store.query) {
        return true;
      }

      return this.className.startsWith(query);
    },

    get store(): IApp {
      return getRoot(self);
    }
  }));

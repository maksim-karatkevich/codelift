import { Instance, getRoot, types } from "mobx-state-tree";
import { classNameGroups } from "./classNameGroups";

import { IApp } from "../App";

export interface ICSSRule extends Instance<typeof CSSRule> {}

export const CSSRule = types
  .model("CSSRule", {
    cssText: types.string,
    selectorText: types.string,
    style: types.frozen(),
    //  TODO Can the ID be the className?
    uuid: types.optional(types.identifierNumber, () => Math.random())
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
      if (!this.store.targeted || !this.store.targeted.element) {
        return false;
      }

      return this.store.targeted.element.hasRule(this as ICSSRule);
    },

    get store(): IApp {
      return getRoot(self);
    }
  }));

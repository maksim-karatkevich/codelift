import { groupBy } from "lodash";
import { observer } from "mobx-react-lite";
import { Instance, types } from "mobx-state-tree";
import { createContext, useContext, SyntheticEvent } from "react";

import { TailwindRule } from "./TailwindRule";

export { observer, TailwindRule };

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
    get appliedTailwindRules() {
      const { target } = self;

      if (!target) {
        return [];
      }

      return this.tailwindRules.filter(match => {
        return target.classList.contains(match.className);
      });
    },

    get document() {
      if (self.iframe) {
        // Required to access contentWindow
        document.domain = "localhost";

        if (self.iframe.contentWindow) {
          return self.iframe.contentWindow.document;
        }
      }

      return null;
    },

    get root() {
      if (this.document) {
        return this.document.querySelector("body");
      }

      return null;
    },

    get queriedTailwindRules() {
      const { query } = self;
      const { tailwindRules } = this;

      if (!query) {
        return tailwindRules;
      }

      const words = query
        .split(" ")
        .map(word => word.trim())
        .filter(Boolean);

      return words.reduce((filtered, word) => {
        const tests = [
          (rule: Instance<typeof TailwindRule>) => {
            return rule.className.startsWith(word);
          },

          (rule: Instance<typeof TailwindRule>) => {
            return rule.cssText.includes(word);
          }
        ];

        return filtered.filter(rule => tests.some(test => test(rule)));
      }, tailwindRules);
    },

    get tailwindRules() {
      if (!this.document) {
        return [];
      }

      const cssStyleRules = [...document.styleSheets]
        .filter(styleSheet => styleSheet instanceof CSSStyleSheet)
        .reduce(
          (acc, styleSheet) => {
            if (styleSheet instanceof CSSStyleSheet) {
              const cssRules = [...styleSheet.cssRules].filter(
                cssRule => cssRule instanceof CSSStyleRule
              );

              return acc.concat(cssRules as CSSStyleRule[]);
            }

            return acc;
          },
          [] as CSSStyleRule[]
        )
        // ? Sorting doesn't seem very useful (yet)
        // .sort((a, b) => {
        //   const [aString, aNumber] = a.selectorText.split(/(\d+$)/);
        //   const [bString, bNumber] = b.selectorText.split(/(\d+$)/);

        //   return (
        //     aString.localeCompare(bString) || Number(aNumber) - Number(bNumber)
        //   );
        // })
        .filter(cssStyleRule => {
          return cssStyleRule.selectorText.startsWith(".");
        });

      return cssStyleRules.map(cssStyleRule => {
        const { cssText, selectorText, style } = cssStyleRule;

        return TailwindRule.create(
          {
            cssText,
            selectorText,
            style: Object.values(style).reduce(
              (acc, property) => ({
                ...acc,
                [property]: style[property as any]
              }),
              {}
            )
          },
          {
            parent: self
          }
        );
      });
    },

    get groupedTailwindRules() {
      return Object.entries(
        groupBy(
          this.queriedTailwindRules
            // Remove duplicates
            // .filter(match => !this.appliedRules.includes(match))
            // Remove :hover, :active, etc.
            .filter(match => match.className.indexOf(":") === -1),
          ({ group = "Other " }) => group
        )
      );
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

    search(value: string) {
      self.query = value;
    },

    unlockTarget() {
      self.isTargetLocked = false;
    }
  }));

export const StoreContext = createContext(Store.create());
export const useStore = () => useContext(StoreContext);

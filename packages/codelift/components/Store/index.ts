import { groupBy, sortBy } from "lodash";
import { observer } from "mobx-react-lite";
import { Instance, types } from "mobx-state-tree";
import { createContext, SyntheticEvent, useContext } from "react";
import { Node } from "./Node";
import { TailwindRule } from "./TailwindRule";

export { observer, TailwindRule };

export const Store = types
  .model("Store", {
    cssRules: types.array(TailwindRule),
    query: "",
    isOpen: true,
    target: types.optional(Node, () => Node.create()),
    selected: types.optional(Node, () => Node.create())
  })
  .volatile(self => ({
    // Needed for scrollX/Y
    contentWindow: null as null | Window,
    // Needed for document.body
    document: null as null | HTMLDocument,
    // In-case of an error accessing the iframe
    error: null as null | Error,
    // Needed for <Selector />
    root: null as null | HTMLElement,
    rule: null as null | Instance<typeof TailwindRule>
  }))
  .views(self => ({
    get appliedCSSRules() {
      const { selected } = self;

      if (!selected) {
        return [];
      }

      return this.queriedCSSRules.filter(selected.hasRule);
    },

    get queriedCSSRules() {
      const { cssRules, query } = self;

      if (!query) {
        return cssRules;
      }

      const words = query
        .split(" ")
        .map(word => word.trim())
        .filter(Boolean);

      const matching = words.reduce(
        (filtered, word) => {
          const tests = [
            (rule: Instance<typeof TailwindRule>) => {
              return rule.className.includes(word);
            },

            (rule: Instance<typeof TailwindRule>) => {
              return rule.cssText.includes(word);
            }
          ];

          return filtered.filter(rule => tests.some(test => test(rule)));
        },
        [...cssRules]
      );

      return sortBy(matching, [
        ...words.map(word => (rule: Instance<typeof TailwindRule>) => {
          return rule.className.startsWith(word) ? -1 : 0;
        }),
        (rule: Instance<typeof TailwindRule>) => {
          return rule.className.replace(/[\d+]/g, "");
        }
      ]);
    },

    get groupedCSSRules() {
      return Object.entries(
        groupBy(
          this.queriedCSSRules
            // Remove duplicates
            // .filter(match => !this.appliedRules.includes(match))
            // Remove :hover, :active, etc.
            .filter(match => match.className.indexOf(":") === -1),
          ({ group = "Other " }) => group
        )
      );
    },

    get root() {
      if (!self.document) {
        return null;
      }

      return (
        // CRA
        self.document.querySelector("#root") ||
        // Next.js
        self.document.querySelector("#__next") ||
        // Whatever
        self.document.querySelector("body")
      );
    }
  }))
  .actions(self => ({
    close() {
      self.isOpen = false;
      self.selected.unset();
      self.target.unset();
    },

    handleFrameLoad(event: SyntheticEvent) {
      if (!(event.target instanceof HTMLIFrameElement)) {
        throw new Error(`handleLoad expected an iFrame`);
      }

      const iframe = event.target;

      if (!iframe.contentWindow) {
        throw new Error("iframe missing contentWindow");
      }

      document.domain = "localhost";

      self.contentWindow = iframe.contentWindow;

      try {
        self.document = iframe.contentWindow.document;
        // @ts-ignore
        self.contentWindow["__CODELIFT__"] = self;
        self.error = null;
      } catch (error) {
        self.error = error;
        console.error(error);

        return;
      }

      window.removeEventListener("keydown", this.handleKeyPress);
      window.addEventListener("keydown", this.handleKeyPress);

      self.contentWindow.removeEventListener("keydown", this.handleKeyPress);
      self.contentWindow.addEventListener("keydown", this.handleKeyPress);

      self.contentWindow.addEventListener("unload", this.handleFrameUnload);

      this.initCSSRules();
      this.reselect();
    },

    handleFrameUnload() {
      self.contentWindow = null;
      self.document = null;
    },

    handleKeyPress(event: KeyboardEvent) {
      const { key, metaKey } = event;

      // CMD+'
      if (metaKey && key === "'") {
        event.preventDefault();

        if (self.isOpen) {
          return this.close();
        } else {
          return this.open();
        }
      }

      // Ignore any other commands until we're open
      if (!self.isOpen) {
        return;
      }

      if (key === "Escape") {
        event.preventDefault();

        if (self.selected.element) {
          return self.selected.unset();
        }

        if (self.isOpen) {
          self.selected.unset();

          return this.close();
        }
      }
    },

    handleStatus(status: string) {
      if (
        status === "idle" &&
        self.document &&
        !self.document.contains(self.selected.element)
      ) {
        this.reselect();
      }
    },

    initCSSRules() {
      if (!self.document) {
        return;
      }

      if (self.cssRules.length) {
        return;
      }

      const styleSheets = [...self.document.styleSheets].filter(
        styleSheet => styleSheet.constructor.name === "CSSStyleSheet"
      );

      const cssStyleRules = styleSheets
        .reduce((acc, styleSheet) => {
          const cssRules = [...(styleSheet as CSSStyleSheet).cssRules].filter(
            cssRule => cssRule.constructor.name === "CSSStyleRule"
          );

          return acc.concat(cssRules as CSSStyleRule[]);
        }, [] as CSSStyleRule[])
        // ? Sorting doesn't seem very useful (yet)
        // .sort((a, b) => {
        //   const [aString, aNumber] = a.selectorText.split(/(\d+$)/);
        //   const [bString, bNumber] = b.selectorText.split(/(\d+$)/);

        //   return (
        //     aString.localeCompare(bString) || Number(aNumber) - Number(bNumber)
        //   );
        // })
        .filter(cssStyleRule => {
          // Only show utility class
          return cssStyleRule.selectorText.lastIndexOf(".") === 0;
        });

      const tailwindRules = cssStyleRules.map(cssStyleRule => {
        const { cssText, selectorText, style } = cssStyleRule;

        return TailwindRule.create({
          cssText,
          selectorText,
          style: Object.values(style).reduce(
            (acc, property) => ({
              ...acc,
              [property]: style[property as any]
            }),
            {}
          )
        });
      });

      self.cssRules.replace(tailwindRules);
    },

    open() {
      self.isOpen = true;
    },

    reselect() {
      if (self.root) {
        const { selector } = self.selected;

        if (selector) {
          const element = self.root.querySelector(selector) as HTMLElement;

          if (element) {
            return self.selected.set(element);
          }
        }
      }

      self.selected.unset();
    },

    resetQuery() {
      self.query = "";
    },

    search(value: string) {
      self.query = value;
    }
  }));

export const StoreContext = createContext(Store.create());
export const useStore = () => useContext(StoreContext);

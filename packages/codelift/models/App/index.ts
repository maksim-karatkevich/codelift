import { groupBy, sortBy } from "lodash";
import { Instance, types } from "mobx-state-tree";
import { SyntheticEvent } from "react";

import { CSSRule, ICSSRule } from "../CSSRule";
import { createChildNodes, INode, Node, flattenNodes } from "../Node";

export interface IApp extends Instance<typeof App> {}

export const App = types
  .model("App", {
    childNodes: types.array(Node),
    cssRules: types.array(CSSRule),
    query: "",
    state: types.optional(
      types.enumeration("State", ["HIDDEN", "VISIBLE"]),
      "VISIBLE"
    ),
    target: types.maybe(types.safeReference(Node)),
    selected: types.maybe(types.safeReference(Node)),
    selector: types.maybe(types.string)
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
    rule: null as null | ICSSRule
  }))
  .views(self => ({
    get appliedCSSRules(): ICSSRule[] {
      const { selected } = self;

      if (!selected) {
        return [];
      }

      return this.queriedCSSRules.filter(selected.hasRule);
    },

    findElementNode(element: HTMLElement) {
      return this.nodes.find(node => node.element === element);
    },

    get queriedCSSRules(): ICSSRule[] {
      const { cssRules, query } = self;

      const words = query
        .split(" ")
        .map(word => word.trim())
        .filter(Boolean);

      const matching = words.reduce(
        (filtered, word) => {
          const tests = [
            (rule: ICSSRule) => {
              return rule.className.includes(word);
            },

            (rule: ICSSRule) => {
              return rule.cssText.includes(word);
            }
          ];

          return filtered.filter(rule => tests.some(test => test(rule)));
        },
        [...cssRules]
      );

      return sortBy(matching, [
        ...words.map(word => (rule: ICSSRule) => {
          return rule.className.startsWith(word) ? -1 : 0;
        }),
        (rule: ICSSRule) => {
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

    get nodes() {
      return flattenNodes(self.childNodes);
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
    clearSelected() {
      self.selected = undefined;
    },

    clearTarget() {
      self.target = undefined;
    },

    close() {
      self.state = "HIDDEN";
      self.selected = undefined;
      self.target = undefined;
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
      this.initNodes();
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

        if (self.state === "VISIBLE") {
          return this.close();
        } else {
          return this.open();
        }
      }

      // Ignore any other commands until we're open
      if (self.state === "HIDDEN") {
        return;
      }

      if (key === "Escape") {
        event.preventDefault();

        if (self.selected) {
          self.selected = undefined;
          return;
        }

        if (self.state === "VISIBLE") {
          return this.close();
        }
      }
    },

    handleStatus(status: string) {
      if (
        status === "idle" &&
        self.document &&
        self.selected &&
        !self.document.contains(self.selected.element)
      ) {
        this.initNodes();
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

      const cssRules = cssStyleRules.map(cssStyleRule => {
        const { cssText, selectorText, style } = cssStyleRule;

        return CSSRule.create({
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

      self.cssRules.replace(cssRules);
    },

    initNodes() {
      if (!self.root) {
        self.childNodes.clear();
        return;
      }

      self.childNodes.replace(createChildNodes(self.root));
    },

    open() {
      self.state = "VISIBLE";
    },

    reselect() {
      const { selector } = self;

      if (self.root && selector) {
        self.selected = self.nodes.find(node => node.selector === selector);
      }
    },

    resetQuery() {
      self.query = "";
    },

    search(value: string) {
      self.query = value;
    },

    selectNode(node: INode) {
      self.selected = node;
      self.selector = node.selector;
    },

    targetNode(node: INode) {
      self.target = node;
    }
  }));

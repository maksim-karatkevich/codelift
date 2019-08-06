import { types } from "mobx-state-tree";
import unique from "unique-selector";

import { rules } from "./rules";

export const AppStore = types
  .model("App", {
    isEnabled: false,
    query: "",
    // TODO Selectors aren't completely reliable
    // so it's better not to use them at all vs. props.
    rootSelector: "#root",
    targetSelector: types.maybe(types.string),
    version: 1
  })
  .views(self => ({
    getRuleClassName(rule: CSSStyleRule) {
      // .hover\:text-purple:hover
      // => hover:text-purple
      return rule.selectorText
        .replace(/^\./, "")
        .replace("\\:", ":")
        .replace(/:active$/, "")
        .replace(/:focus$/, "")
        .replace(/:hover$/, "");
    },

    get root(): HTMLElement {
      return document.querySelector(self.rootSelector) as HTMLElement;
    },

    // TODO Convert to Rule[]
    get rules(): CSSStyleRule[] {
      return rules;
    },

    // TODO Convert to Rule[] or targetClasses
    get targetRules() {
      if (!this.target) {
        throw new Error("target has not been selected");
      }

      if (self.version) {
      }

      const classNames = [...this.target.classList];
      const { getRuleClassName } = this;

      return this.rules.filter(rule =>
        classNames.includes(getRuleClassName(rule))
      );
    },

    get target(): HTMLElement | null {
      if (self.targetSelector) {
        return document.querySelector(self.targetSelector);
      }

      return null;
    }
  }))
  .actions(self => ({
    addTargetPreview(rule: CSSStyleRule) {
      if (!self.target) {
        throw new Error("Cannot preview rule for undefined target");
      }

      const className = self.getRuleClassName(rule);

      if (self.targetRules.includes(rule)) {
        self.target.classList.remove(className);
      } else {
        self.target.classList.add(className);
      }
    },

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

    removeTargetPreview(rule: CSSStyleRule) {
      if (!self.target) {
        throw new Error("Cannot preview rule for undefined target");
      }

      const className = self.getRuleClassName(rule);

      if (self.targetRules.includes(rule)) {
        self.target.classList.add(className);
      } else {
        self.target.classList.remove(className);
      }
    },

    removeTargetRule(rule: CSSStyleRule) {
      if (!self.target) {
        throw new Error("Cannot remove rule for undefined target");
      }

      const className = self.getRuleClassName(rule);

      self.target.classList.remove(className);
      self.version++;
    },

    setQuery(query: string) {
      self.query = query;
    },

    setTarget(element?: HTMLElement) {
      self.targetSelector = element ? unique(element) : undefined;
    }
  }));

import { useReducer } from "react";

import { getClassName } from "../Rule";

type Rules = CSSStyleRule[];

export const useElementRules = (element: HTMLElement, rules: Rules) => {
  const getElementRules = () => {
    const classNames = [...element.classList];

    return rules.filter(rule => classNames.includes(getClassName(rule)));
  };

  return useReducer((rules, action) => {
    const { type, rule } = action;

    switch (type) {
      case "add":
        element.classList.add(getClassName(rule));
        break;

      case "hide":
        element.classList.remove(getClassName(rule));
        return rules;

      case "remove":
        element.classList.remove(getClassName(rule));
        break;

      case "show":
        element.classList.add(getClassName(rule));
        return rules;

      case "reset":
        return getElementRules();

      default:
        throw new Error(`useElementRules does not support "${type}" action`);
    }

    return getElementRules();
  }, getElementRules());
};

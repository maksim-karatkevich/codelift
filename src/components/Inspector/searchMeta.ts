import { classNameGroups } from "./classNameGroups";

const cssRules = [...document.styleSheets]
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
  );

export const searchMeta = cssRules
  .filter(cssRule => {
    return cssRule.selectorText.startsWith(".");
  })
  .sort((a, b) => {
    const [aString, aNumber] = a.selectorText.split(/(\d+$)/);
    const [bString, bNumber] = b.selectorText.split(/(\d+$)/);

    return aString.localeCompare(bString) || Number(aNumber) - Number(bNumber);
  })
  .map(rule => {
    const { selectorText } = rule;
    const className = selectorText
      .slice(1)
      .split("\\/")
      .join("/");

    const words = className.split("-");

    let group;

    for (const pattern in classNameGroups) {
      if (className.startsWith(pattern)) {
        group = classNameGroups[pattern];
        break;
      }
    }

    return {
      className,
      group,
      rule,
      selectorText,
      words
    };
  });

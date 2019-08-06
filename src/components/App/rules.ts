export const rules = [...document.styleSheets]
  .reduce(
    (acc, sheet) => {
      if (sheet instanceof CSSStyleSheet) {
        return acc.concat([...sheet.cssRules] as CSSStyleRule[]);
      }

      return acc;
    },
    [] as CSSStyleRule[]
  )
  .filter(cssRule => {
    if (cssRule.type !== 1) {
      return false;
    }

    if (!cssRule.selectorText.startsWith(".")) {
      return false;
    }

    return true;
  })
  .sort((a, b) => {
    const [aString, aNumber] = a.selectorText.split(/(\d+$)/);
    const [bString, bNumber] = b.selectorText.split(/(\d+$)/);

    return aString.localeCompare(bString) || Number(aNumber) - Number(bNumber);
  });

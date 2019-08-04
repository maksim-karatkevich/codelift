import { groupBy } from "lodash-es";

const cssRules = Array.from(document.styleSheets);

const rules = cssRules
  .reduce((acc, sheet) => {
    // @ts-ignore
    return acc.concat(Array.from(sheet.cssRules));
  }, [])
  .filter(cssRule => {
    // @ts-ignore
    if (cssRule.type !== 1) {
      return false;
    }

    // @ts-ignore
    if (!cssRule.selectorText.startsWith(".")) {
      return false;
    }

    return true;
  })
  .sort((a, b) => {
    // @ts-ignore
    const [aString, aNumber] = a.selectorText.split(/(\d+$)/);
    // @ts-ignore
    const [bString, bNumber] = b.selectorText.split(/(\d+$)/);

    return aString.localeCompare(bString) || aNumber - bNumber;
  });

export const useRules = (query: string) => {
  const filteredRules = rules.filter((rule: CSSStyleRule) => {
    if (!query) {
      return true;
    }

    const tokens = query
      .split(" ")
      .map(fragment => fragment.trim())
      .filter(Boolean);

    const matchesQuery = tokens.every(fragment =>
      rule.cssText.includes(fragment)
    );

    if (!matchesQuery) {
      return false;
    }

    return true;
  });

  const groupedRules = Object.entries(
    groupBy(filteredRules, (rule: CSSStyleRule) => {
      return rule.style.cssText
        .split(";")
        .filter(Boolean)
        .map(style => style.split(":").shift())
        .filter(Boolean)
        .join(", ");
    })
  )
    // Remove properties that can't be applied (e.g. touch)
    .filter(([properties]) => Boolean(properties))
    .sort(([a], [b]) => a.localeCompare(b));

  return { filteredRules, groupedRules, rules };
};

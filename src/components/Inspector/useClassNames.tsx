import { groupBy } from "lodash-es";
import { useMemo } from "react";

import { GROUPS } from "./groups";
import { classNameGroups } from "./classNameGroups";

const classNames = [...document.styleSheets]
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
  .filter(cssRule => {
    return cssRule.selectorText.startsWith(".");
  })
  .map(cssRule => {
    return cssRule.selectorText.slice(1);
  })
  .sort((a, b) => {
    const [aString, aNumber] = a.split(/(\d+$)/);
    const [bString, bNumber] = b.split(/(\d+$)/);

    return aString.localeCompare(bString) || Number(aNumber) - Number(bNumber);
  });

export const useClassNames = (element: HTMLElement, query: string) => {
  return useMemo(() => {
    const elementClassNames = [...element.classList];
    const groups = groupBy(
      classNames
        // Remove duplicates
        .filter(className => !elementClassNames.includes(className))
        // Remove :hover, :active, etc.
        .filter(className => className.indexOf(":") === -1),

      className => {
        for (const pattern in classNameGroups) {
          if (className.startsWith(pattern)) {
            return classNameGroups[pattern];
          }
        }

        console.warn(`${className} does not belong to a group`);

        return GROUPS.OTHER;
      }
    );

    const groupedClassNames: { [group in GROUPS]: string[] } = Object.values(
      GROUPS
    ).reduce((acc, group) => {
      if (groups[group]) {
        acc[group] = groups[group];
      }

      return acc;
    }, {});

    return { classNames, elementClassNames, groupedClassNames };
  }, [element]);
};

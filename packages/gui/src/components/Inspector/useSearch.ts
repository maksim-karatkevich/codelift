import { groupBy, intersection } from "lodash-es";
import matchSorter, { rankings } from "match-sorter";
import { useMemo } from "react";

import { searchMeta } from "./searchMeta";

const classNames = searchMeta.map(meta => meta.className);

export const useSearch = (element: HTMLElement, query: string) => {
  return useMemo(() => {
    const matches = intersection(
      ...query.split(" ").map(token =>
        matchSorter(searchMeta, token, {
          keys: ["className", "words", "group", "rule.cssText"],
          // "padding left 4" => [px-4, pl-16, px-64]
          threshold: rankings.CONTAINS
        })
      )
    ).sort(
      (a, b) =>
        classNames.indexOf(a.className) - classNames.indexOf(b.className)
    );

    const elementResults = matches.filter(match =>
      element.classList.contains(match.className)
    );

    const groupedResults = groupBy(
      matches
        // Remove duplicates
        .filter(match => !elementResults.includes(match))
        // Remove :hover, :active, etc.
        .filter(match => match.className.indexOf(":") === -1),
      ({ group = "Other " }) => group
    );

    return { elementResults, groupedResults };
  }, [element, query]);
};

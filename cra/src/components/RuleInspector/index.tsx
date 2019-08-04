import React, { FunctionComponent, useState, useEffect } from "react";

import { useRules } from "./useRules";
import { useElementRules } from "./useElementRules";
import { Rule } from "../Rule";

type RuleInspectorProps = {
  element: HTMLElement;
};

export const RuleInspector: FunctionComponent<RuleInspectorProps> = ({
  element
}) => {
  const [query, setQuery] = useState();
  const { filteredRules, groupedRules } = useRules(query);
  const [elementRules, dispatch] = useElementRules(element, filteredRules);

  const handleClick = (rule: CSSStyleRule) => () => {
    dispatch({
      type: elementRules.includes(rule) ? "remove" : "add",
      rule
    });
    setQuery(undefined);
  };

  const handleMouseEnter = (rule: CSSStyleRule) => () => {
    dispatch({
      type: elementRules.includes(rule) ? "hide" : "show",
      rule
    });
  };

  const handleMouseLeave = (rule: CSSStyleRule) => () => {
    dispatch({
      type: elementRules.includes(rule) ? "show" : "hide",
      rule
    });
  };

  return (
    <>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-700 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        onChange={event => setQuery(event.target.value)}
        defaultValue={query}
        placeholder="Search..."
      />

      <ul className="pb-2 list-reset overflow-auto">
        <li>
          <ol>
            <label className="shadow-inner sticky pin-t block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black">
              Current Styles
            </label>

            {elementRules.map((rule: CSSStyleRule) => (
              <Rule
                key={rule.selectorText}
                onClick={handleClick(rule)}
                onMouseEnter={handleMouseEnter(rule)}
                onMouseLeave={handleMouseLeave(rule)}
                rule={rule}
              />
            ))}
          </ol>
        </li>

        {groupedRules.map(([name, rules]) => (
          <li key={name}>
            <label className="shadow-inner sticky pin-t block text-sm px-2 py-1 my-2 tracking-wide bg-black">
              {name}
              <small className="float-right rounded bg-black px-1 py-px bg-gray-900">
                {rules.length}
              </small>
            </label>

            <ol>
              {rules.map(rule => (
                <Rule
                  key={rule.selectorText}
                  onClick={handleClick(rule)}
                  onMouseEnter={handleMouseEnter(rule)}
                  onMouseLeave={handleMouseLeave(rule)}
                  rule={rule}
                />
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </>
  );
};

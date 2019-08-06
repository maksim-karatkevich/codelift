import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useState, useEffect } from "react";

import { useStore } from "../App";

type RuleProps = {
  rule: CSSStyleRule;
};

// @TODO Store classes in the state tree for previewing
// { "bg-blue-500": false, "bg-pink-900": true }
// Disable any existing classes that share the same rule cssText
export const Rule: FunctionComponent<RuleProps> = observer(({ rule }) => {
  const store = useStore();
  const [preview, setPreview] = useState(false);
  const [toggled, setToggled] = useState(false);
  const hasRule = store.targetRules.includes(rule);
  const className = store.getRuleClassName(rule);

  // Preview class change when rule has not been toggled yet
  useEffect(() => {
    const { target } = store;

    console.log({ className, preview, toggled });

    if (target && preview && !toggled) {
      hasRule
        ? target.classList.remove(className)
        : target.classList.add(className);
    }
  }, [className, preview, toggled]);

  // Commit class change when toggled
  useEffect(() => {
    const { target } = store;

    console.log({ className, toggled });

    if (target && toggled) {
      hasRule
        ? target.classList.remove(className)
        : target.classList.add(className);
    }
  }, [className, toggled]);

  // Re-instate classes that were changed when previewed on unmount
  useEffect(() => {
    const { target } = store;

    return () => {
      if (target) {
        if (preview && !toggled) {
          hasRule
            ? target.classList.add(className)
            : target.classList.remove(className);
        }
      }
    };
  });

  return (
    <li
      className="cursor-pointer font-mono font-hairline text-sm py-1 px-2 hover:bg-gray-600"
      onClick={event => setToggled(!toggled)}
      onMouseEnter={event => setPreview(true)}
      onMouseLeave={event => setPreview(false)}
    >
      <label
        className={`cursor-pointer ${
          hasRule
            ? toggled
              ? "line-through opacity-50"
              : "opacity-100"
            : toggled
            ? "opacity-100"
            : "opacity-50"
        }`}
      >
        {store.getRuleClassName(rule)}
      </label>
    </li>
  );
});

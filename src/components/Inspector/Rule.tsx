import React, { FunctionComponent, useState, useEffect } from "react";

type RuleProps = {
  className: string;
  element: HTMLElement;
  onAdd?: (className: string) => void;
};

// @TODO Store classes in the state tree for previewing
// { "bg-blue-500": false, "bg-pink-900": true }
// Disable any existing classes that share the same rule cssText
export const Rule: FunctionComponent<RuleProps> = ({
  className,
  element,
  onAdd
}) => {
  const [preview, setPreview] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [hasRule] = useState([...element.classList].includes(className));

  // const className = store.getRuleClassName(rule);

  // Preview class change when rule has not been toggled yet
  useEffect(() => {
    if (preview && !toggled) {
      hasRule
        ? element.classList.remove(className)
        : element.classList.add(className);
    }
  }, [className, element, hasRule, preview, toggled]);

  // Commit class change when toggled
  useEffect(() => {
    if (toggled) {
      if (hasRule) {
        element.classList.remove(className);
      } else {
        element.classList.add(className);

        if (onAdd) {
          onAdd(className);
        }
      }
    }
  }, [className, element, hasRule, onAdd, toggled]);

  // Re-instate classes that were changed when previewed on unmount
  useEffect(() => {
    return () => {
      if (preview && !toggled) {
        hasRule
          ? element.classList.add(className)
          : element.classList.remove(className);
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
        {className}
      </label>
    </li>
  );
};

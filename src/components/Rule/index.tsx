import React, { FunctionComponent, MouseEvent, useState } from "react";

type RuleProps = {
  onClick?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  rule: CSSStyleRule;
};

// TODO Move to MobX model, since any usage of Rule expects to get .className
export const getClassName = (rule: CSSStyleRule) => {
  // .hover\:text-purple:hover
  // => hover:text-purple
  return rule.selectorText
    .replace(/^\./, "")
    .replace("\\:", ":")
    .replace(/:active$/, "")
    .replace(/:focus$/, "")
    .replace(/:hover$/, "");
};

export const Rule: FunctionComponent<RuleProps> = ({
  onClick,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  rule
}) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <li
      className="cursor-pointer font-mono font-hairline text-sm py-1 px-2 hover:bg-gray-600"
      onClick={onClick}
      onMouseEnter={event => {
        setIsOver(true);
        onMouseEnter(event);
      }}
      onMouseLeave={event => {
        setIsOver(false);
        onMouseLeave(event);
      }}
    >
      <label className="cursor-pointer">{getClassName(rule)}</label>

      {isOver && (
        <code className="text-xs mt-1 block opacity-75">
          {rule.cssText.replace(rule.selectorText, "").trim()}
        </code>
      )}
    </li>
  );
};

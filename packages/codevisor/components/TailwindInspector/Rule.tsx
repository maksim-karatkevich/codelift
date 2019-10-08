import { Instance } from "mobx-state-tree";
import { FunctionComponent } from "react";

import { observer, TailwindRule, useStore } from "../Store";

type RuleProps = {
  rule: Instance<typeof TailwindRule>;
};

export const Rule: FunctionComponent<RuleProps> = observer(({ rule }) => {
  const store = useStore();
  const setToggled = (bool: boolean) => {};
  const setPreview = (bool: boolean) => {};
  const toggled = false;

  return (
    <li
      className="cursor-pointer font-mono font-hairline text-sm py-1 px-2 hover:bg-gray-600"
      onClick={() => store.handleRuleClick(rule)}
      onMouseEnter={() => store.handleRuleEnter(rule)}
      onMouseLeave={() => store.handleRuleLeave(rule)}
    >
      <label
        className={`cursor-pointer ${
          rule.isApplied
            ? toggled
              ? "line-through opacity-50"
              : "opacity-100"
            : toggled
            ? "opacity-100"
            : "opacity-50"
        }`}
      >
        {rule.className}
      </label>
    </li>
  );
});

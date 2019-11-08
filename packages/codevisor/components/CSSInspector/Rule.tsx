import { Instance } from "mobx-state-tree";
import { FunctionComponent } from "react";
import { useMutation } from "urql";

import { observer, TailwindRule, useStore } from "../Store";

type RuleProps = {
  rule: Instance<typeof TailwindRule>;
};

const getReactElement = (element: HTMLElement) => {
  for (const key in element) {
    if (key.startsWith("__reactInternalInstance$")) {
      // @ts-ignore
      return element[key];
    }
  }
};

export const Rule: FunctionComponent<RuleProps> = observer(({ rule }) => {
  const [res, toggleClassName] = useMutation(`
  mutation ToggleClassName(
    $className: String!
    $fileName: String!
    $lineNumber: Int!
    ) {
      toggleClassName(
        className: $className
        fileName: $fileName
        lineNumber: $lineNumber
        )
      }
      `);

  if (res.error) {
    console.error(res.error);

    throw new Error(res.error.toString());
  }

  const { target } = useStore();
  const toggled = false;
  const toggleRule = (rule: Instance<typeof TailwindRule>) => {
    const { className } = rule;
    const { debugSource } = target;

    if (!debugSource) {
      console.error("Selected element is missing _debugSource property");
    }

    target.applyRule(rule);

    toggleClassName({ ...debugSource, className });
  };

  return (
    <li
      className="cursor-pointer font-mono font-hairline text-xs py-1 px-2 hover:bg-gray-600"
      onClick={() => toggleRule(rule)}
      onMouseEnter={() => target.previewRule(rule)}
      onMouseLeave={() => target.cancelRule(rule)}
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

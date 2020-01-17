import { FunctionComponent } from "react";

import { ICSSRule } from "../../models/CSSRule";
import { Menu } from "./Menu";
import { useStore, observer } from "../../store";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";

type ButtonMenuProps = {
  label: string | JSX.Element;
  render: (rule: ICSSRule) => JSX.Element;
  rules: ICSSRule[];
};

export const ButtonMenu: FunctionComponent<ButtonMenuProps> = observer(
  ({ label, render, rules }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();
    const previewedRule = store.selected?.element?.previewedRule;

    if (previewedRule && rules.includes(previewedRule)) {
      label = (
        <>
          <code
            className={previewedRule.isApplied ? "line-through" : undefined}
          >
            {previewedRule?.className}
          </code>
        </>
      );
    }

    rules = rules.filter(Boolean);

    const selected = rules.find(rule => rule.isApplied);

    return (
      <Menu label={label} selected={selected}>
        <ul className="flex justify-between p-2">
          {rules.map(rule => (
            <li key={rule.className}>
              <button
                className={`${
                  res.fetching ? "cursor-wait" : "cursor-pointer"
                } border relative rounded shadow-inner ${
                  rule.isApplied ? "bg-green-300" : "bg-gray-300"
                } overflow-hidden text-gray-700 hover:shadow-outline`}
                onMouseLeave={() => store.selected?.element?.cancelPreview()}
                onMouseOver={() => store.selected?.element?.previewRule(rule)}
                onClick={updateClassName}
              >
                {render(rule)}
              </button>
            </li>
          ))}
        </ul>
      </Menu>
    );
  }
);

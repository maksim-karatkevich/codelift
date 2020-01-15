import { capitalize } from "lodash";
import { FunctionComponent } from "react";

import { useStore, observer } from "../../store";
import { Menu } from "./Menu";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";

type SelectProps = {
  label: string;
  match: string;
};

const translate = (className: string) => {
  const [, suffix] = className.split("-");

  switch (suffix) {
    case undefined:
      return "Default";
    case "md":
      return "Medium";
    case "lg":
      return "Large";
    case "xl":
      return "X-Large";
    case "2xl":
      return "XX-Large";
    default:
      return capitalize(suffix);
  }
};

export const Select: FunctionComponent<SelectProps> = observer(
  ({ label, match }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();

    const rules = store.cssRules.filter(cssRule => {
      return (
        cssRule.className.indexOf(":") === -1 &&
        String(Object.keys(cssRule.style)) === match
      );
    });

    return (
      <Menu label={label}>
        <ul>
          {rules.map(rule => (
            <li
              className={`flex items-center px-3 h-8 text-black text-xs hover:bg-gray-200 ${
                rule.isApplied ? "font-bold" : "font-normal"
              } ${res.fetching ? "cursor-wait" : "cursor-pointer"}`}
              key={rule.className}
              onMouseLeave={() => store.selected?.element?.cancelPreview()}
              onMouseOver={() => store.selected?.element?.previewRule(rule)}
              onClick={updateClassName}
              value={rule.className}
            >
              {translate(rule.className)}
            </li>
          ))}
        </ul>
      </Menu>
    );
  }
);

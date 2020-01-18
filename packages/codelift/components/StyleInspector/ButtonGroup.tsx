import { FunctionComponent } from "react";
import { ICSSRule } from "../../models/CSSRule";
import { useStore, observer } from "../../store";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";

type ButtonGroupProps = {
  label?: string;
  render: (rule: ICSSRule) => JSX.Element;
  rules: ICSSRule[];
};

export const ButtonGroup: FunctionComponent<ButtonGroupProps> = observer(
  ({ label, render, rules }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();

    rules = rules.filter(Boolean);

    const selected = rules.find(rule => rule.isApplied);

    return (
      <div
        className={`flex items-center ${
          selected ? "text-white font-bold" : "text-gray-400"
        } px-2 h-8 text-xs hover:bg-gray-800`}
      >
        {label && <label className="flex-grow select-none">{label}</label>}

        <div className="flex shadow-md rounded overflow-hidden">
          {rules.map((rule, i) => (
            <button
              className={`relative p-1 px-2 bg-white font-thin text-xs text-gray-700 ${
                rule.isApplied
                  ? "bg-green-100 border-t shadow-inner"
                  : "border-b"
              } ${i === 0 ? "" : "border-l"} ${
                res.fetching ? "cursor-wait" : ""
              } hover:bg-blue-100`}
              disabled={res.fetching}
              key={rule.className}
              onMouseLeave={() => store.selected?.element?.cancelPreview()}
              onMouseOver={() => store.selected?.element?.previewRule(rule)}
              onClick={updateClassName}
            >
              {render(rule)}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

import { FunctionComponent, useEffect, useMemo, useState } from "react";

import { observer, useStore } from "../../store";

type SliderProps = {
  label: string;
  match: RegExp;
};

export const Slider: FunctionComponent<SliderProps> = observer(
  ({ label, match }) => {
    const store = useStore();
    const { rules, leftOfZero, rightOfZero } = useMemo(() => {
      // TODO Sort by size
      const rules = store.cssRules.filter(cssRule => {
        return cssRule.className.match(match);
      });

      const leftOfZero = rules.filter(cssRule =>
        cssRule.className.startsWith("-")
      ).length;

      const rightOfZero = rules.filter(
        cssRule => !cssRule.className.startsWith("-")
      ).length;

      return { rules, leftOfZero, rightOfZero };
    }, [store.cssRules.length]);

    const selectedRule = rules.find(rule => {
      if (store.selected && store.selected.element) {
        return store.selected.element.classNames.includes(rule.className);
      }

      return false;
    });

    const initialValue = selectedRule ? rules.indexOf(selectedRule) + 1 : 0;
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      if (!store.selected || !store.selected.element) {
        return;
      }

      const { element } = store.selected;
      const previewRule = value ? rules[leftOfZero + value - 1] : null;

      if (previewRule) {
        element.previewRule(previewRule);
      } else {
        element.cancelRule();
      }
    }, [value]);

    return (
      <label
        className={`flex items-center ${
          value === 0 ? "text-gray-400" : "text-white font-bold"
        } px-3 py-1 text-xs`}
      >
        <span className="w-24">
          {label}
          {value !== initialValue && "*"}
        </span>
        <input
          className="bg-gray-600 appearance-none h-1 ml-3 rounded shadow-inner w-full"
          onChange={event => setValue(parseInt(event.target.value, 10))}
          min={-leftOfZero}
          max={rightOfZero}
          type="range"
          value={value}
        />
      </label>
    );
  }
);

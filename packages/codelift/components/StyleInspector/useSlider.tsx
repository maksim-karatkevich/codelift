import { useLocalStore } from "mobx-react-lite";
import { useEffect } from "react";

import { ICSSRule } from "../../models/CSSRule";
import { useStore } from "../../store";
import { SliderProps } from "./Slider";

export const useSlider = (props: SliderProps) => {
  const store = useStore();
  // TODO Use MST for typingss
  const slider: any = useLocalStore(
    source => ({
      value: 0,

      get hasChanges() {
        return slider.rule !== slider.initialRule;
      },

      get initialRule() {
        return slider.rules.find((rule: ICSSRule) => {
          return store.selected?.element?.hasRule(rule) || false;
        });
      },

      get initialValue() {
        return slider.initialRule
          ? -slider.leftOfZero + slider.rules.indexOf(slider.initialRule)
          : 0;
      },

      get leftOfZero() {
        // Don't subtract -1 because 0 means rule is disabled/removed
        return slider.rules.filter((rule: ICSSRule) => {
          return rule.className.startsWith("-");
        }).length;
      },

      get rightOfZero() {
        return slider.rules.filter((rule: ICSSRule) => {
          return !rule.className.startsWith("-");
        }).length;
      },

      get rule() {
        return slider.value
          ? slider.rules[slider.leftOfZero + slider.value - 1]
          : undefined;
      },

      get rules() {
        const { match } = source;
        const keys = Array.isArray(match) ? match : [match];

        return store.cssRules
          .filter(cssRule => {
            return (
              cssRule.className.indexOf(":") === -1 &&
              String(Object.keys(cssRule.style)) === String(keys)
            );
          })
          .sort((a, b) => {
            // TODO Sort by actual `value(cssRule)`
            let [aString, aUnit] = a.className.split(/(\d+|px|auto$)/);
            let [bString, bUnit] = b.className.split(/(\d+|px|auto$)/);

            // Treat `px` as a value between 1 & 0 for sorting
            if (aUnit === "px") aUnit = "0.1";
            if (bUnit === "px") bUnit = "0.1";

            // Treat `auto` as a larger value than 64
            if (aUnit === "auto") aUnit = "1000";
            if (bUnit === "auto") bUnit = "1000";

            // String order wins out, since the unit isn't a tie-breaker
            const textOrder = aString.localeCompare(bString);

            // Reverse negative sort so that it's bigger numbers are first
            const direction =
              a.className.startsWith("-") && b.className.startsWith("-")
                ? -1
                : 1;

            if (textOrder) {
              return direction * textOrder;
            }

            const numberOrder = Number(aUnit) - Number(bUnit);

            if (numberOrder) {
              return direction * numberOrder;
            }

            return 0;
          });
      },

      setValue(value: number) {
        if (!store.selected || !store.selected.element) {
          return;
        }

        slider.value = value;

        const { element } = store.selected;

        element.cancelPreview();

        if (value === 0 && slider.initialValue) {
          // Setting the value to 0 should remove the existing rule
          element.previewRule(slider.initialRule);
        } else if (slider.rule !== slider.initialRule) {
          // Using a different value should update the preview
          element.previewRule(slider.rule);
        }
      }
    }),
    props
  );

  useEffect(() => {
    slider.setValue(slider.initialValue);
  }, [store.selected?.element]);

  return slider;
};

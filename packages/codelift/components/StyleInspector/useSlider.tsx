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
          if (store.selected && store.selected.element) {
            return store.selected.element.classNames.includes(rule.className);
          }

          return false;
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
        // Shorten by -1 since the 0th position is for when the rule is disabled/removed
        return (
          slider.rules.filter((rule: ICSSRule) => {
            return !rule.className.startsWith("-");
          }).length - 1
        );
      },

      get rule() {
        return slider.value
          ? slider.rules[slider.leftOfZero + slider.value]
          : null;
      },

      get rules() {
        return store.cssRules
          .filter(cssRule => cssRule.className.match(source.match))
          .sort((a, b) => {
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

        if (slider.rule) {
          // Using the default value should cancel preview
          if (slider.rule === slider.initialRule) {
            element.cancelPreview();
          } else {
            // Only preview when the rule differs from the initial
            element.previewRule(slider.rule);
          }
        } else if (slider.initialRule) {
          // Setting the value to 0 should remove the existing rule
          element.previewRule(slider.initialRule);
        }
      }
    }),
    props
  );

  useEffect(() => {
    slider.setValue(slider.initialValue);
  }, [store.selected && store.selected.element]);

  return slider;
};

import { FunctionComponent } from "react";

import { observer, useStore } from "../../store";
import { useSlider } from "./useSlider";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";
import { ICSSRule } from "../../models/CSSRule";

export type SliderProps = {
  label?: string;
  rules: ICSSRule[];
};

// Show actual value somehow? https://github.com/davidchin/react-input-range
// TODO Get rid of the negative slider values and instead:
// - Far left = 0 = Remove existing rule, if any.
// - > 1 = Add rule. If selected rule already exists, no-op.
export const Slider: FunctionComponent<SliderProps> = observer(props => {
  const slider = useSlider(props);
  const [res, updateClassName] = useUpdateClassName();
  const tickPercentage = `${100 / slider.rules.length}%`;

  return (
    <label
      className={`flex items-center ${
        slider.value === 0
          ? "font-normal text-black"
          : "font-bold text-green-600"
      } px-3 h-8 text-xs`}
    >
      {props.label && (
        <span className="select-none w-32">
          {props.label}
          {slider.value !== slider.initialValue && "*"}
        </span>
      )}
      <input
        className={`text-gray-300 appearance-none h-1 ml-2 rounded shadow-inner w-full ${
          res.fetching ? "cursor-wait opacity-50" : "cursor-move"
        }`}
        disabled={res.fetching}
        onMouseUp={event => {
          if (slider.hasChanges) {
            updateClassName();
          }
        }}
        onChange={event => slider.setValue(parseInt(event.target.value, 10))}
        min={-slider.leftOfZero}
        max={slider.rightOfZero}
        style={{
          background: `repeating-linear-gradient(to right, currentColor, currentColor 1px, transparent 1px, transparent ${tickPercentage})`
        }}
        type="range"
        value={slider.value}
      />
    </label>
  );
});

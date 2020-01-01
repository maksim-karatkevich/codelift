import { FunctionComponent } from "react";

import { observer, useStore } from "../../store";
import { useSlider } from "./useSlider";

export type SliderProps = {
  label: string;
  match: RegExp;
};

// Show actual value somehow? https://github.com/davidchin/react-input-range
export const Slider: FunctionComponent<SliderProps> = observer(props => {
  const store = useStore();
  const slider = useSlider(props);

  return (
    <label
      className={`flex items-center ${
        slider.value === 0 ? "text-gray-400" : "text-white font-bold"
      } px-3 py-1 text-xs`}
    >
      <span className="w-24">
        {props.label}
        {slider.value !== slider.initialValue && "*"}
      </span>
      <input
        className="bg-gray-600 appearance-none h-1 ml-3 rounded shadow-inner w-full"
        onMouseUp={event => {
          if (slider.currentRule !== slider.initialRule) {
            store.selected?.element?.save();
          }
        }}
        onChange={event => slider.setValue(parseInt(event.target.value, 10))}
        min={-slider.leftOfZero}
        max={slider.rightOfZero}
        type="range"
        value={slider.value}
      />
    </label>
  );
});

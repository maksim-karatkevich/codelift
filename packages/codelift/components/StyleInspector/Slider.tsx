import { FunctionComponent } from "react";
import { useMutation } from "urql";

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

  const [res, updateClassName] = useMutation(`
    mutation UpdateClassName(
      $className: String
      $fileName: String!
      $lineNumber: Int!
    ) {
      updateClassName(
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

  return (
    <label
      className={`flex items-center ${
        slider.value === 0 ? "text-gray-400" : "text-white font-bold"
      } px-3 py-1 text-xs`}
    >
      <span className="w-32">
        {props.label}
        {slider.value !== slider.initialValue && "*"}
      </span>
      <input
        className={`bg-gray-600 appearance-none h-1 ml-3 rounded shadow-inner w-full ${
          res.fetching ? "cursor-wait opacity-50" : "cursor-move"
        }`}
        disabled={res.fetching}
        onMouseUp={event => {
          if (slider.hasChanges && store.selected?.element) {
            const { className, debugSource } = store.selected.element;

            updateClassName({ ...debugSource, className });
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

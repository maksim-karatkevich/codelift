import { FunctionComponent } from "react";
import { ChevronDown } from "react-feather";

import { Slider } from "./Slider";

const Heading: FunctionComponent = ({ children }) => (
  <button className="flex items-center text-left text-white bg-black px-2 py-1 shadow text-sm w-full">
    {children}
    <ChevronDown className="flex-none ml-2" size={12} />
  </button>
);

export const StyleInspector: FunctionComponent = () => {
  return (
    <ol>
      <li>
        <Heading>
          <span className="w-full">Margin</span>
        </Heading>

        <ol>
          <li>
            <Slider label="All" match={/^-?m-/} />
          </li>
          <li>
            <Slider label="Horizontal" match={/^-?mx-/} />
          </li>
          <li>
            <Slider label="Vertical" match={/^-?my-/} />
          </li>
          <li>
            <Slider label="Top" match={/^-?mt-/} />
          </li>
          <li>
            <Slider label="Right" match={/^-?mr-/} />
          </li>
          <li>
            <Slider label="Bottom" match={/^-?mb-/} />
          </li>
          <li>
            <Slider label="Left" match={/^-?ml-/} />
          </li>
        </ol>
      </li>
      <li>
        <Heading>
          <span className="w-full">Padding</span>
        </Heading>
        <ol>
          <li>
            <Slider label="All" match={/^-?p-/} />
          </li>
          <li>
            <Slider label="Horizontal" match={/^-?px-/} />
          </li>
          <li>
            <Slider label="Vertical" match={/^-?py-/} />
          </li>
          <li>
            <Slider label="Top" match={/^-?pt-/} />
          </li>
          <li>
            <Slider label="Right" match={/^-?pr-/} />
          </li>
          <li>
            <Slider label="Bottom" match={/^-?pb-/} />
          </li>
          <li>
            <Slider label="Left" match={/^-?pl-/} />
          </li>
        </ol>
      </li>
    </ol>
  );
};

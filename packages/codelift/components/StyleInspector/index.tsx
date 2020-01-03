import { FunctionComponent, useState } from "react";
import { ChevronRight } from "react-feather";

import { Palette } from "./Palette";
import { Slider } from "./Slider";

export const StyleInspector: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const Heading: FunctionComponent = ({ children }) => (
    <button
      className="flex items-center text-left text-white bg-black px-2 py-1 shadow text-sm w-full"
      // @ts-ignore Property 'onClick' does not exist on type 'IntrinsicAttributes & { children?: ReactNode; }'.
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <ChevronRight
        className="flex-none ml-2"
        size={12}
        style={{
          transform: `rotate(${isOpen ? 90 : 0}deg)`,
          transition: "all 200ms ease-in-out"
        }}
      />
    </button>
  );

  return (
    <ol className="text-gray-400 text-xs">
      <li>
        <Heading>
          <span className="w-full">Margin</span>
        </Heading>

        <ol>
          <li>
            <Slider hidden={!isOpen} label="All" match={/^-?m-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Horizontal" match={/^-?mx-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Vertical" match={/^-?my-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Top" match={/^-?mt-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Right" match={/^-?mr-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Bottom" match={/^-?mb-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Left" match={/^-?ml-/} />
          </li>
        </ol>
      </li>
      <li>
        <Heading>
          <span className="w-full">Padding</span>
        </Heading>
        <ol>
          <li>
            <Slider hidden={!isOpen} label="All" match={/^-?p-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Horizontal" match={/^-?px-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Vertical" match={/^-?py-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Top" match={/^-?pt-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Right" match={/^-?pr-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Bottom" match={/^-?pb-/} />
          </li>
          <li>
            <Slider hidden={!isOpen} label="Left" match={/^-?pl-/} />
          </li>
        </ol>
      </li>
      <li>
        <Heading>
          <span className="w-full">Position</span>
        </Heading>
        <ol>
          <li>
            <Slider hidden={!isOpen} label="z-Index" match={/^z-/} />
          </li>
        </ol>
      </li>
      <li>
        <Heading>
          <span className="w-full">Background</span>
        </Heading>
        <ol>
          <li>
            <Palette hidden={!isOpen} match={/^bg-(\w+)-\d+/} />
          </li>
        </ol>
      </li>
    </ol>
  );
};

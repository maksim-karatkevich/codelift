import { useSelect, StateChangeFunction } from "downshift";
import { FunctionComponent, useState } from "react";

import { Palette } from "./Palette";
import { SliderMenu } from "./SliderMenu";

export const StyleInspector: FunctionComponent = () => {
  const Heading: FunctionComponent = ({ children }) => (
    <button className="flex items-center text-left text-white bg-black px-2 py-1 shadow text-sm w-full">
      {children}
    </button>
  );

  return (
    <ol className="text-gray-400 text-xs">
      <li>
        <Heading>
          <span className="w-full">Layout</span>
        </Heading>

        <ol>
          <li>
            <SliderMenu
              label="Margin"
              items={[
                { label: "All", match: /^-?m-/ },
                { label: "Horizontal", match: /^-?mx-/ },
                { label: "Vertical", match: /^-?my-/ },
                { label: "Top", match: /^-?mt-/ },
                { label: "Right", match: /^-?mr-/ },
                { label: "Bottom", match: /^-?mb-/ },
                { label: "Left", match: /^-?ml-/ }
              ]}
            />
          </li>
          <li>
            <SliderMenu
              label="Padding"
              items={[
                { label: "All", match: /^-?p-/ },
                { label: "Horizontal", match: /^-?px-/ },
                { label: "Vertical", match: /^-?py-/ },
                { label: "Top", match: /^-?pt-/ },
                { label: "Right", match: /^-?pr-/ },
                { label: "Bottom", match: /^-?pb-/ },
                { label: "Left", match: /^-?pl-/ }
              ]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading>
          <span className="w-full">Position</span>
        </Heading>

        <ol>
          <li>
            <SliderMenu label="z-Index" items={[{ match: /^z-/ }]} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>
          <span className="w-full">Background</span>
        </Heading>

        <ol>
          <li>
            <Palette label="Background" match={/^bg-(black|white|\w+-\d00)/} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>
          <span className="w-full">Text</span>
        </Heading>

        <ol>
          <li>
            <Palette label="Color" match={/^text-(black|white|\w+-\d00)/} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>
          <span className="w-full">Effects</span>
        </Heading>

        <ol>
          <li>
            <SliderMenu label="Opacity" items={[{ match: /^opacity-/ }]} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>
          <span className="w-full">Border</span>
        </Heading>

        <ol>
          <li>
            <Palette label="Color" match={/^border-(\w+)-\d00/} />
          </li>
          <li>
            <SliderMenu
              label="Size"
              items={[
                { label: "All", match: /^border-\d+/ },
                { label: "Top", match: /^border-t-\d+/ },
                { label: "Right", match: /^border-r-\d+/ },
                { label: "Bottom", match: /^border-b-\d+/ },
                { label: "Left", match: /^border-l-\d+/ }
              ]}
            />
          </li>
        </ol>
      </li>
    </ol>
  );
};

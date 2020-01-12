import { useSelect, StateChangeFunction } from "downshift";
import { FunctionComponent, useState } from "react";

import { Palette } from "./Palette";
import { SliderMenu } from "./SliderMenu";

export const StyleInspector: FunctionComponent = () => {
  const Heading: FunctionComponent = ({ children }) => (
    <button className="flex items-center text-left text-white bg-black px-2 py-1 shadow text-sm w-full">
      <span className="w-full">{children}</span>
    </button>
  );

  return (
    <ol className="text-gray-400 text-xs">
      <li>
        <Heading>Layout</Heading>

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
        <Heading>Position</Heading>

        <ol>
          <li>
            <SliderMenu label="z-Index" items={[{ match: /^z-/ }]} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Background</Heading>

        <ol>
          <li>
            <Palette
              label="Color"
              filter={cssRule =>
                cssRule.className.indexOf(":") === -1 &&
                cssRule.style["background-color"]
              }
              value={cssRule => cssRule.style["background-color"]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Text</Heading>

        <ol>
          <li>
            <Palette
              label="Color"
              filter={cssRule =>
                cssRule.className.indexOf(":") === -1 && cssRule.style.color
              }
              value={cssRule => cssRule.style.color}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Effects</Heading>

        <ol>
          <li>
            <SliderMenu label="Opacity" items={[{ match: /^opacity-/ }]} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Border</Heading>

        <ol>
          <li>
            <Palette
              filter={cssRule =>
                cssRule.className.indexOf(":") === -1 &&
                [
                  "border-top-color",
                  "border-right-color",
                  "border-bottom-color",
                  "border-left-color"
                ].every(style => cssRule.style[style])
              }
              label="Color"
              value={cssRule => cssRule.style["border-top-color"]}
            />
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

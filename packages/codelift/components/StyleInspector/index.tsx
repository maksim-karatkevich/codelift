import { useSelect, StateChangeFunction } from "downshift";
import { FunctionComponent } from "react";

import { Palette } from "./Palette";
import { SliderMenu } from "./SliderMenu";
import { Select } from "./Select";

export const StyleInspector: FunctionComponent = () => {
  // TODO Add a toggle for :hover,, :focus, :active based on selectorText
  const Heading: FunctionComponent = ({ children }) => (
    <label className="flex items-center text-left text-white bg-black px-2 py-1 shadow sticky text-sm top-0 w-full z-10">
      {children}
    </label>
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
                {
                  label: "All",
                  match: [
                    "margin-top",
                    "margin-right",
                    "margin-bottom",
                    "margin-left"
                  ]
                },
                { label: "Horizontal", match: ["margin-left", "margin-right"] },
                { label: "Vertical", match: ["margin-top", "margin-bottom"] },
                { label: "Top", match: "margin-top" },
                { label: "Right", match: "margin-right" },
                { label: "Bottom", match: "margin-bottom" },
                { label: "Left", match: "margin-left" }
              ]}
            />
          </li>
          <li>
            <SliderMenu
              label="Padding"
              items={[
                {
                  label: "All",
                  match: [
                    "padding-top",
                    "padding-right",
                    "padding-bottom",
                    "padding-left"
                  ]
                },
                {
                  label: "Horizontal",
                  match: ["padding-left", "padding-right"]
                },
                { label: "Vertical", match: ["padding-top", "padding-bottom"] },
                { label: "Top", match: "padding-top" },
                { label: "Right", match: "padding-right" },
                { label: "Bottom", match: "padding-bottom" },
                { label: "Left", match: "padding-left" }
              ]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Position</Heading>

        <ol>
          <li>
            <SliderMenu label="z-Index" items={[{ match: "z-index" }]} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Background</Heading>

        <ol>
          <li>
            <Palette label="Color" match="background-color" />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Text</Heading>

        <ol>
          <li>
            <Palette label="Color" match="color" />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Effects</Heading>

        <ol>
          <li>
            <SliderMenu label="Opacity" items={[{ match: "opacity" }]} />
          </li>
          <li>
            <Select label="Shadow" match="box-shadow" />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Border</Heading>

        <ol>
          <li>
            <Palette
              label="Color"
              match={[
                "border-top-color",
                "border-right-color",
                "border-bottom-color",
                "border-left-color"
              ]}
            />
          </li>
          <li>
            <SliderMenu
              label="Size"
              items={[
                {
                  label: "All",
                  match: [
                    "border-top-width",
                    "border-right-width",
                    "border-bottom-width",
                    "border-left-width"
                  ]
                },
                { label: "Top", match: "border-top-width" },
                { label: "Right", match: "border-right-width" },
                { label: "Bottom", match: "border-bottom-width" },
                { label: "Left", match: "border-left-width" }
              ]}
            />
          </li>
        </ol>
      </li>
    </ol>
  );
};

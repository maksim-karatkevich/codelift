import { FunctionComponent } from "react";

import { Palette } from "./Palette";
import { SliderMenu } from "./SliderMenu";
import { Select } from "./Select";
import { useStore } from "../../store";

const Heading: FunctionComponent = ({ children }) => (
  <label className="flex items-center text-left text-white bg-black px-2 py-1 shadow sticky text-sm top-0 w-full z-10">
    {children}
  </label>
);

export const StyleInspector: FunctionComponent = () => {
  const store = useStore();

  // TODO Add a toggle for :hover,, :focus, :active based on selectorText
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
                  rules: store.findRulesByStyle([
                    "margin-top",
                    "margin-right",
                    "margin-bottom",
                    "margin-left"
                  ])
                },
                {
                  label: "Horizontal",
                  rules: store.findRulesByStyle(["margin-left", "margin-right"])
                },
                {
                  label: "Vertical",
                  rules: store.findRulesByStyle(["margin-top", "margin-bottom"])
                },
                { label: "Top", rules: store.findRulesByStyle("margin-top") },
                {
                  label: "Right",
                  rules: store.findRulesByStyle("margin-right")
                },
                {
                  label: "Bottom",
                  rules: store.findRulesByStyle("margin-bottom")
                },
                { label: "Left", rules: store.findRulesByStyle("margin-left") }
              ]}
            />
          </li>
          <li>
            <SliderMenu
              label="Padding"
              items={[
                {
                  label: "All",
                  rules: store.findRulesByStyle([
                    "padding-top",
                    "padding-right",
                    "padding-bottom",
                    "padding-left"
                  ])
                },
                {
                  label: "Horizontal",
                  rules: store.findRulesByStyle([
                    "padding-left",
                    "padding-right"
                  ])
                },
                {
                  label: "Vertical",
                  rules: store.findRulesByStyle([
                    "padding-top",
                    "padding-bottom"
                  ])
                },
                { label: "Top", rules: store.findRulesByStyle("padding-top") },
                {
                  label: "Right",
                  rules: store.findRulesByStyle("padding-right")
                },
                {
                  label: "Bottom",
                  rules: store.findRulesByStyle("padding-bottom")
                },
                { label: "Left", rules: store.findRulesByStyle("padding-left") }
              ]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Position</Heading>

        <ol>
          <li>
            <SliderMenu
              label="z-Index"
              items={[{ rules: store.findRulesByStyle("z-index") }]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Background</Heading>

        <ol>
          <li>
            <Palette
              label="Color"
              rules={store.findRulesByStyle("background-color")}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Text</Heading>

        <ol>
          <li>
            <Palette label="Color" rules={store.findRulesByStyle("color")} />
          </li>
        </ol>
      </li>

      <li>
        <Heading>Effects</Heading>

        <ol>
          <li>
            <SliderMenu
              label="Opacity"
              items={[{ rules: store.findRulesByStyle("opacity") }]}
            />
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
              rules={store.findRulesByStyle([
                "border-top-color",
                "border-right-color",
                "border-bottom-color",
                "border-left-color"
              ])}
            />
          </li>
          <li>
            <SliderMenu
              label="Size"
              items={[
                {
                  label: "All",
                  rules: store.findRulesByStyle([
                    "border-top-width",
                    "border-right-width",
                    "border-bottom-width",
                    "border-left-width"
                  ])
                },
                {
                  label: "Top",
                  rules: store.findRulesByStyle("border-top-width")
                },
                {
                  label: "Right",
                  rules: store.findRulesByStyle("border-right-width")
                },
                {
                  label: "Bottom",
                  rules: store.findRulesByStyle("border-bottom-width")
                },
                {
                  label: "Left",
                  rules: store.findRulesByStyle("border-left-width")
                }
              ]}
            />
          </li>
        </ol>
      </li>
    </ol>
  );
};

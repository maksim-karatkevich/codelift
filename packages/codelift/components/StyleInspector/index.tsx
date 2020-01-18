import { capitalize, words } from "lodash";
import { ComponentType, FunctionComponent } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignJustify,
  AlignRight,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowLeftCircle,
  ArrowRightCircle,
  Crosshair,
  Image,
  Layout,
  Loader,
  Lock,
  Maximize,
  Minimize,
  Move,
  Props,
  Square,
  Trello,
  Type,
  XCircle,
} from "react-feather";

import { ICSSRule } from "../../models/CSSRule";
import { observer, useStore } from "../../store";
import { Search } from "../Search";
import { Palette } from "./Palette";
import { Select } from "./Select";
import { SliderMenu } from "./SliderMenu";
import { Menu } from "./Menu";
import { ButtonGroup } from "./ButtonGroup";

type HeadingProps = {
  Icon?: ComponentType<Props>;
};

const Heading: FunctionComponent<HeadingProps> = ({ children, Icon }) => (
  <label className="flex items-center text-left text-gray-500 px-2 py-1 shadow sticky text-sm top-0 w-full z-10 bg-black">
    {Icon && <Icon className="mr-2" size={13} />}
    <span className="w-full">{children}</span>
  </label>
);

export const StyleInspector: FunctionComponent = observer(() => {
  const store = useStore();

  // TODO Add a toggle for :hover,, :focus, :active based on selectorText
  return (
    <ol className="text-gray-400 text-xs" hidden={!store.selected?.isElement}>
      <li>
        <Search />
      </li>
      <li>
        <Heading Icon={Layout}>Layout</Heading>
        <ol>
          <li>
            <Select
              label="Display"
              render={rule => capitalize(words(rule.className).join(" "))}
              rules={store.findRulesByStyle("display")}
            />
          </li>
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
        <Heading Icon={Trello}>Flexbox</Heading>

        <ol>
          <li>
            <Select
              label="Direction"
              rules={store.findRulesByStyle("flex-direction")}
            />
          </li>
          <li>
            <Select label="Wrap" rules={store.findRulesByStyle("flex-wrap")} />
          </li>
          <li>
            <Select
              label="Align Items"
              rules={store.findRulesByStyle("align-items")}
            />
          </li>
          <li>
            <Select
              label="Align Content"
              rules={store.findRulesByStyle("align-content")}
            />
          </li>
          <li>
            <Select
              label="Align Self"
              rules={store.findRulesByStyle("align-self")}
            />
          </li>
          <li>
            <Select
              label="Justify Content"
              rules={store.findRulesByStyle("justify-content")}
            />
          </li>
          <li>
            <ButtonGroup
              label="Shrink"
              render={rule => {
                return ({
                  "flex-shrink": <Minimize size={13} />,
                  "flex-shrink-0": <Lock size={13} />
                } as any)[rule.className];
              }}
              rules={store.findRulesByStyle("flex-shrink")}
            />
          </li>
          <li>
            <ButtonGroup
              label="Grow"
              render={rule => {
                return ({
                  "flex-grow": <Maximize size={13} />,
                  "flex-grow-0": <Lock size={13} />
                } as any)[rule.className];
              }}
              rules={store.findRulesByStyle("flex-grow")}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Move}>Size</Heading>

        <ol>
          <li>
            <SliderMenu
              label="Width"
              items={[
                {
                  label: "Width",
                  rules: store.findRulesByStyle("width")
                },
                {
                  label: "Min Width",
                  rules: store.findRulesByStyle("min-width")
                },
                {
                  label: "Max Width",
                  rules: store.findRulesByStyle("max-width")
                }
              ]}
            />
          </li>
          <li>
            <SliderMenu
              label="Height"
              items={[
                {
                  label: "Height",
                  rules: store.findRulesByStyle("height")
                },
                {
                  label: "Min Height",
                  rules: store.findRulesByStyle("min-height")
                },
                {
                  label: "Max Height",
                  rules: store.findRulesByStyle("max-height")
                }
              ]}
            />
          </li>
          <li>
            <Menu
              label="Overflow"
              selected={[
                ...store.findRulesByStyle(["overflow-x", "overflow-y"]),
                ...store.findRulesByStyle("overflow-x"),
                ...store.findRulesByStyle("overflow-y")
              ].find(rule => rule.isApplied)}
            >
              <Select
                label="All"
                rules={store.findRulesByStyle(["overflow-x", "overflow-y"])}
              />
              <Select
                label="Horizontal"
                rules={store.findRulesByStyle("overflow-x")}
              />
              <Select
                label="Vertical"
                rules={store.findRulesByStyle("overflow-y")}
              />
            </Menu>
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Crosshair}>Position</Heading>

        <ol>
          <li>
            <Select
              label="Position"
              rules={store.findRulesByStyle("position")}
            />
          </li>
          <li>
            <ButtonGroup
              label="Pinning"
              render={rule => {
                return ({
                  "top-0": <ArrowUp size={13} />,
                  "right-0": <ArrowRight size={13} />,
                  "bottom-0": <ArrowDown size={13} />,
                  "left-0": <ArrowLeft size={13} />
                } as any)[rule.className];
              }}
              rules={[
                store.cssRuleByClassName["top-0"],
                store.cssRuleByClassName["right-0"],
                store.cssRuleByClassName["bottom-0"],
                store.cssRuleByClassName["left-0"]
              ]}
            />
          </li>
          <li>
            <ButtonGroup
              label="Float"
              render={rule => {
                return ({
                  "float-left": <ArrowLeftCircle size={13} />,
                  "float-none": <XCircle size={13} />,
                  "float-right": <ArrowRightCircle size={13} />
                } as any)[rule.className];
              }}
              rules={[
                store.cssRuleByClassName["float-left"],
                store.cssRuleByClassName["float-none"],
                store.cssRuleByClassName["float-right"]
              ]}
            />
          </li>
          <li>
            <SliderMenu
              label="Z Index"
              items={[{ rules: store.findRulesByStyle("z-index") }]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Image}>Background</Heading>

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
        <Heading Icon={Type}>Typography</Heading>

        <ol>
          <li>
            <Select
              label="Font"
              rules={store.findRulesByStyle("font-family")}
            />
          </li>
          <li>
            {/* TODO Cannot use SelectMenu because the ordering is weird */}
            <Select
              label="Weight"
              rules={store.findRulesByStyle("font-weight")}
            />
          </li>
          <li>
            <SliderMenu
              label="Size"
              items={[{ rules: store.findRulesByStyle("font-size") }]}
            />
          </li>
          <li>
            <ButtonGroup
              label="Align"
              render={rule => {
                return ({
                  "text-left": <AlignLeft size={13} />,
                  "text-center": <AlignCenter size={13} />,
                  "text-right": <AlignRight size={13} />,
                  "text-justify": <AlignJustify size={13} />
                } as any)[rule.className];
              }}
              rules={store.findRulesByStyle("text-align")}
            />
          </li>
          <li>
            <Select
              label="Vertical Align"
              render={rule => rule.className}
              rules={store.findRulesByStyle("vertical-align")}
            />
          </li>
          <li>
            <SliderMenu
              label="Letter Spacing"
              items={[{ rules: store.findRulesByStyle("letter-spacing") }]}
            />
          </li>
          <li>
            <SliderMenu
              label="Line Height"
              items={[{ rules: store.findRulesByStyle("line-height") }]}
            />
          </li>
          <li>
            <Palette label="Color" rules={store.findRulesByStyle("color")} />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Loader}>Effects</Heading>

        <ol>
          <li>
            <SliderMenu
              label="Opacity"
              items={[{ rules: store.findRulesByStyle("opacity") }]}
            />
          </li>
          <li>
            <Select
              label="Shadow"
              rules={store.findRulesByStyle("box-shadow")}
            />
          </li>
          <li>
            <Select
              label="Cursor"
              render={rule => (
                <div
                  className={`${rule.className} flex w-full h-full items-center`}
                >
                  {capitalize(
                    words(rule.className)
                      .slice(1)
                      .join(" ")
                  )}
                </div>
              )}
              rules={store.findRulesByStyle("cursor")}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Square}>Border</Heading>

        <ol>
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
          <li>
            <Select
              label="Style"
              rules={store.findRulesByStyle([
                "border-top-style",
                "border-right-style",
                "border-bottom-style",
                "border-left-style"
              ])}
            />
          </li>
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
              label="Radius"
              items={[
                {
                  label: "All",
                  rules: store.findRulesByStyle([
                    "border-top-left-radius",
                    "border-top-right-radius",
                    "border-bottom-left-radius",
                    "border-bottom-right-radius"
                  ])
                },
                {
                  label: "Top Left",
                  rules: store.findRulesByStyle("border-top-left-radius")
                },
                {
                  label: "Top Right",
                  rules: store.findRulesByStyle("border-top-right-radius")
                },
                {
                  label: "Bottom Left",
                  rules: store.findRulesByStyle("border-bottom-left-radius")
                },
                {
                  label: "Bottom Right",
                  rules: store.findRulesByStyle("border-bottom-right-radius")
                }
              ]}
            />
          </li>
        </ol>
      </li>
    </ol>
  );
});

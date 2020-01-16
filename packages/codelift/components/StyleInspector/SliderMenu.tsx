import { FunctionComponent } from "react";

import { Slider, SliderProps } from "./Slider";
import { Menu } from "./Menu";
import { observer } from "../../store";

type SliderMenuProps = {
  label: string;
  items: SliderProps[];
};

// TODO Highlight the label if the rules match
export const SliderMenu: FunctionComponent<SliderMenuProps> = observer(
  ({ label, items }) => {
    const selected = items
      .map(item => item.rules)
      .flat()
      .find(rule => rule.isApplied);

    return (
      <Menu label={label} selected={selected}>
        <ul>
          {items.map((item, i) => (
            <li className="hover:bg-gray-200" key={`${item.label}-${i}`}>
              <Slider {...item} />
            </li>
          ))}
        </ul>
      </Menu>
    );
  }
);

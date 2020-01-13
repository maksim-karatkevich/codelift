import { FunctionComponent } from "react";

import { Slider, SliderProps } from "./Slider";
import { Menu } from "./Menu";

type SliderMenuProps = {
  label: string;
  items: SliderProps[];
};

// TODO Highlight the label if the rules match
export const SliderMenu: FunctionComponent<SliderMenuProps> = ({
  label,
  items
}) => {
  return (
    <Menu label={label}>
      <ul>
        {items.map((item, i) => (
          <li className="hover:bg-gray-200" key={`${item.label}-${i}`}>
            <Slider {...item} />
          </li>
        ))}
      </ul>
    </Menu>
  );
};

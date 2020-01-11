import { FunctionComponent, useState } from "react";
import { ChevronDown } from "react-feather";

import { Slider } from "./Slider";
import { Menu } from "./Menu";

type Item = {
  label?: string;
  match: RegExp;
};

type SliderMenuProps = {
  label: string;
  items: Item[];
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
            <Slider label={item.label} match={item.match} />
          </li>
        ))}
      </ul>
    </Menu>
  );
};

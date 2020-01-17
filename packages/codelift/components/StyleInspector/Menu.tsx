import { FunctionComponent, useState } from "react";
import { ChevronDown } from "react-feather";
import { ICSSRule } from "../../models/CSSRule";
import { observer, useStore } from "../../store";

type MenuProps = {
  label: string | JSX.Element;
  icon?: JSX.Element;
  selected?: ICSSRule;
};

export const Menu: FunctionComponent<MenuProps> = observer(
  ({
    children,
    icon = <ChevronDown className="flex-none ml-2" size={12} />,
    label,
    selected
  }) => {
    const store = useStore();
    const [isOpen, setIsOpen] = useState(false);

    // TODO without access to `rules`, all *Menu.tsx files have to customize the preview `label`
    return (
      <div className="relative" onMouseLeave={() => isOpen && setIsOpen(false)}>
        <label
          className={`${
            isOpen
              ? "bg-white rounded-b-none text-black font-bold z-50"
              : `border border-gray-800 ${
                  selected ? "text-white font-bold" : "text-gray-400"
                }
            hover:bg-gray-800`
          } relative cursor-pointer m-2 rounded flex items-center px-2 h-8 select-none shadow text-xs`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="w-full">{label}</span>
          {icon}
        </label>
        <div
          className="absolute outline-none -mt-2 shadow-md z-40 w-full"
          hidden={!isOpen}
        >
          <div className="bg-white mx-2 rounded-b overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

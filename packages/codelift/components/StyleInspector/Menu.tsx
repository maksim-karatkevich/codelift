import { FunctionComponent, useState } from "react";
import { ChevronDown } from "react-feather";
import { ICSSRule } from "../../models/CSSRule";
import { observer } from "../../store";

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
    const [isOpen, setIsOpen] = useState(false);

    // TODO without access to `rules`, all *Menu.tsx files have to customize the preview `label`
    return (
      <div
        className={`relative border-green-600 ${isOpen ? "border-l-2" : ""}`}
        onMouseLeave={() => isOpen && setIsOpen(false)}
      >
        <label
          className={`${
            isOpen
              ? "bg-white text-black font-bold z-50 shadow"
              : `${selected ? "font-bold" : ""}`
          } relative cursor-pointer flex items-center px-2 h-8 select-none text-xs`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="w-full">{label}</span>
          {icon}
        </label>
        <div
          className="absolute bg-gray-100 text-black outline-none shadow-lg z-40 w-full border-b border-black rounded-b"
          hidden={!isOpen}
        >
          {children}
        </div>
      </div>
    );
  }
);

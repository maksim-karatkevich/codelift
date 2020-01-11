import { ComponentType, FunctionComponent, useState } from "react";
import { ChevronDown } from "react-feather";

type MenuProps = {
  label: string;
  icon?: JSX.Element;
};

export const Menu: FunctionComponent<MenuProps> = ({
  children,
  icon = <ChevronDown className="flex-none ml-2" size={12} />,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseLeave={() => isOpen && setIsOpen(false)}>
      <label
        className={`${
          isOpen
            ? "bg-white rounded-b-none text-black font-bold z-50"
            : "border border-gray-800 text-gray-400 hover:bg-gray-800"
        } relative cursor-pointer m-2 rounded flex items-center px-3 h-8 select-none shadow text-xs`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-full">{label}</span>
        {icon}
      </label>
      <div
        className="absolute outline-none -mt-2 shadow-md z-40 w-full"
        hidden={!isOpen}
        onMouseUp={() => setIsOpen(false)}
      >
        <div className="bg-white mx-2 rounded-b overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

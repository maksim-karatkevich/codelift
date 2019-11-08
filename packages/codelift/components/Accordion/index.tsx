import cx from "classnames";
import { FunctionComponent, ReactElement, useState } from "react";

type PanelProps = {
  label: string | ReactElement;
  onToggle?: () => void;
};

export const useAccordion = (initialSelectedIndex = 0) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  let totalPanels = 0;

  const Panel: FunctionComponent<PanelProps> = ({
    children,
    label,
    onToggle = () => {}
  }) => {
    const panelIndex = totalPanels++;
    const isOpen = panelIndex === selectedIndex;
    const isCustomLabel = typeof label !== "string";

    return (
      <section
        className={cx(
          "bg-gray-900",
          "relative",
          "shadow-inner",
          "text-white",
          isOpen && "flex-grow",
          isOpen && "overflow-auto"
        )}
      >
        <header
          className={cx(
            "bg-white",
            "border-teal-800",
            "cursor-pointer",
            "font-medium",
            "py-2",
            "shadow",
            "text-xs",
            "text-teal-800",
            "tracking-widest",
            "w-64",
            "z-10",
            isOpen && "border-l-4",
            isOpen && "fixed",
            isOpen ? "px-3" : "px-4",
            !isCustomLabel && "uppercase"
          )}
          onClick={() => {
            setSelectedIndex(panelIndex);
            onToggle();
          }}
        >
          {label}
        </header>

        {isOpen && (
          <main className="max-h-full overflow-y-auto pt-8">{children}</main>
        )}
      </section>
    );
  };

  return [Panel];
};

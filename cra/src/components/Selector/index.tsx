import React, { FunctionComponent, useEffect, useState } from "react";

type SelectorProps = {
  root: HTMLElement;
  onSelect: (element: HTMLElement) => void;
};

export const Selector: FunctionComponent<SelectorProps> = ({
  root,
  onSelect
}) => {
  const [rect, setRect] = useState();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      onSelect(target);
    };
    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      setRect(target.getBoundingClientRect());
    };

    root.addEventListener("mousemove", handleMouseMove);
    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return (
    <>
      <p className="inline-flex items-center border-l-2 m-6 p-6 text-center bg-gray-700">
        Select an element
        <svg
          className="fill-current opacity-75 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
      </p>

      {rect && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-600 opacity-50 pointer-events-none text-black"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% 100%, ${rect.right}px 100%, ${
              rect.right
            }px ${rect.top}px, ${rect.left}px ${rect.top}px, ${rect.left}px ${
              rect.bottom
            }px, ${rect.right}px ${rect.bottom}px, ${
              rect.right
            }px 100%, 0 100%)`,
            transition: "all 200ms ease-out"
          }}
        />
      )}
    </>
  );
};

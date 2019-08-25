import React, { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Tree } from "./Tree";

type SelectorProps = {
  onSelect: (element: HTMLElement) => void;
  root: HTMLElement;
};

export const Selector: FunctionComponent<SelectorProps> = ({
  onSelect,
  root
}) => {
  const [rect, setRect] = useState();
  const [target, setTarget] = useState();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      onSelect(event.target as HTMLElement);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setTarget(event.target as HTMLElement);
    };

    root.addEventListener("mousemove", handleMouseMove);
    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleMouseMove);
    };
  });

  useEffect(() => {
    if (target) {
      setRect(target.getBoundingClientRect());
    }
  }, [target]);

  return (
    <>
      <section className="shadow-inner p-3 pr-0 overflow-auto">
        <Tree
          root={root}
          onHover={setTarget}
          onSelect={onSelect}
          target={target}
        />
      </section>

      {rect &&
        createPortal(
          <div
            className="fixed top-0 left-0 w-full h-full bg-gray-600 opacity-50 pointer-events-none text-black z-40"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, ${
                rect.right
              }px 100%, ${rect.right}px ${rect.top}px, ${rect.left}px ${
                rect.top
              }px, ${rect.left}px ${rect.bottom}px, ${rect.right}px ${
                rect.bottom
              }px, ${rect.right}px 100%, 0 100%)`,
              transition: "all 200ms ease-out"
            }}
          />,
          root
        )}
    </>
  );
};

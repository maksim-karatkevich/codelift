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
  const [rect, setRect] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

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

  const { top, right, bottom, left } = rect;
  const width = right - left;
  const height = bottom - top;

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
        target &&
        createPortal(
          <div
            className="fixed pointer-events-none z-40 border-blue-500 border border-dashed"
            style={{
              left: `calc(16rem + ${left}px)`,
              height,
              width,
              top,
              transition: "all 200ms ease-in-out"
            }}
          >
            <label className="absolute text-white font-mono text-xs bg-blue-500 px-1 py-px -mt-5 -ml-px rounded-t truncate max-w-full">
              {target.tagName.toLowerCase()}
              <small className="text-blue-200">
                {target.className
                  ? `.${target.className.split(" ").join(".")}`
                  : null}
              </small>
            </label>
            <div className="w-full h-full bg-blue-100 opacity-50" />
          </div>,
          document.body
        )}
    </>
  );
};

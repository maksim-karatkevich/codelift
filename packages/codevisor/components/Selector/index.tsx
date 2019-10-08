import React, { FunctionComponent, useEffect } from "react";
import { createPortal } from "react-dom";

import { observer, useStore } from "../Store";

export const Selector: FunctionComponent = observer(() => {
  const store = useStore();
  const { root, target } = store;

  useEffect(() => {
    if (!root) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      store.handleTargetSelect(event.target as HTMLElement);
    };

    const handleMouseMove = (event: MouseEvent) => {
      store.handleTargetHover(event.target as HTMLElement);
    };

    root.addEventListener("mousemove", handleMouseMove);
    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleMouseMove);
    };
  }, [root]);

  if (!target.element) {
    return null;
  }

  const { top, right, bottom, left } = target.element.getBoundingClientRect();
  const width = right - left;
  const height = bottom - top;

  return createPortal(
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
        {target.element.tagName.toLowerCase()}
        <small className="text-blue-200">
          {typeof target.element.className === "string"
            ? `.${target.element.className.split(" ").join(".")}`
            : null}
        </small>
      </label>
      <div className="w-full h-full bg-blue-100 opacity-50" />
    </div>,
    document.body
  );
});

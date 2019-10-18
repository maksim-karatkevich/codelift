import React, { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { observer, useStore } from "../Store";

export const Selector: FunctionComponent = observer(() => {
  const store = useStore();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const { root } = store;

    if (!root) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      store.handleTargetSelect(event.target as HTMLElement);
    };

    const handleLeave = (event: MouseEvent) => {
      setIsHovering(false);
    };

    const handleHover = (event: MouseEvent) => {
      setIsHovering(true);
      store.handleTargetHover(event.target as HTMLElement);
    };

    root.addEventListener("mouseleave", handleLeave);
    root.addEventListener("mousemove", handleHover);
    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("mouseleave", handleLeave);
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleHover);
    };
  }, [store.root]);

  if (!store.contentWindow || !store.document || !store.target.element) {
    return null;
  }

  const {
    top,
    right,
    bottom,
    left
  } = store.target.element.getBoundingClientRect();

  return createPortal(
    <div
      className="absolute pointer-events-none z-40 border-blue-500 border border-dashed"
      style={{
        opacity: isHovering ? 1 : 0,
        left: left + store.contentWindow.scrollX,
        height: bottom - top,
        width: right - left,
        top: top + store.contentWindow.scrollY,
        transition: "all 200ms ease-in-out"
      }}
    >
      <label className="absolute text-white font-mono text-xs bg-blue-500 px-1 py-px -mt-5 -ml-px rounded-t truncate max-w-full">
        {store.target.element.tagName.toLowerCase()}

        <small className="text-blue-200">
          {typeof store.target.element.className === "string"
            ? `.${store.target.element.className.split(" ").join(".")}`
            : null}
        </small>
      </label>
      <div className="w-full h-full bg-blue-100 opacity-50" />
    </div>,
    store.document.body
  );
});

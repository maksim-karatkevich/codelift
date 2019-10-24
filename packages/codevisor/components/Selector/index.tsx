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
      event.preventDefault();
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
      style={{
        border: "1px dashed #4299e1",
        height: bottom - top,
        left: left + store.contentWindow.scrollX,
        opacity: isHovering ? 1 : 0,
        pointerEvents: "none",
        position: "absolute",
        top: top + store.contentWindow.scrollY,
        transition: "all 200ms ease-in-out",
        width: right - left,
        zIndex: 40
      }}
    >
      <label
        style={{
          background: "#4299e1",
          borderRadius: "0.25rem 0.25rem 0 0",
          color: "#ffffff",
          fontFamily:
            'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: "12px",
          marginLeft: "-1px",
          marginTop: "-18px",
          maxWidth: "100%",
          overflow: "hidden",
          position: "absolute",
          padding: "2px 4px",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {store.target.element.tagName.toLowerCase()}

        <small style={{ color: "#bee3f8" }}>
          {typeof store.target.element.className === "string"
            ? `.${store.target.element.className.split(" ").join(".")}`
            : null}
        </small>
      </label>
      <div
        style={{
          background: "#ebf8ff",
          height: "100%",
          opacity: 0.5,
          width: "100%"
        }}
      />
    </div>,
    store.document.body
  );
});

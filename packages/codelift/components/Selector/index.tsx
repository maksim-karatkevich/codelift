import { Instance } from "mobx-state-tree";
import React, { FunctionComponent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { observer, useStore } from "../Store";
import { Node } from "../Store/Node";

type SelectorProps = {
  node: Instance<typeof Node>;
};

export const Selector: FunctionComponent<SelectorProps> = observer(
  ({ node }) => {
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

      const handleHover = (event: MouseEvent) => {
        setIsHovering(event.target === node.element);
        store.handleTargetHover(event.target as HTMLElement);
      };

      root.addEventListener("mousemove", handleHover);
      root.addEventListener("click", handleClick);

      return () => {
        root.removeEventListener("click", handleClick);
        root.removeEventListener("mousemove", handleHover);
      };
    }, [store.root]);

    if (!store.contentWindow || !store.document || !node.element) {
      return null;
    }

    const { top, right, bottom, left } = node.element.getBoundingClientRect();

    return createPortal(
      <div
        id="__codelift-selector"
        style={{
          border: "1px dashed #4299e1",
          height: bottom - top,
          left: left + store.contentWindow.scrollX,
          opacity: node.isPreviewing ? 0 : 1,
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
            borderRadius: "4px 4px 0 0",
            color: "#ffffff",
            fontFamily:
              'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: "12px",
            marginLeft: "-1px",
            marginTop: "-22px",
            maxWidth: "100%",
            overflow: "hidden",
            position: "absolute",
            padding: "2px 4px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {node.element.tagName.toLowerCase()}

          <small style={{ color: "#bee3f8" }}>
            {typeof node.element.className === "string"
              ? `.${node.element.className.split(" ").join(".")}`
              : null}
          </small>
        </label>
        <div
          style={{
            background: "#ebf8ff",
            height: "100%",
            opacity: isHovering ? 0.5 : 0,
            transition: "all 200ms ease-in-out",
            width: "100%"
          }}
        />
      </div>,
      store.document.body
    );
  }
);

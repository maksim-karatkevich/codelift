import { Instance } from "mobx-state-tree";
import React, { FunctionComponent } from "react";
import { createPortal } from "react-dom";
import { observer, useStore } from "../Store";
import { Node } from "../Store/Node";

type PortalProps = {
  node: Instance<typeof Node>;
};

export const Portal: FunctionComponent<PortalProps> = observer(({ node }) => {
  const store = useStore();

  if (!store.contentWindow || !store.document || !node.element) {
    return null;
  }

  const { top, right, bottom, left } = node.element.getBoundingClientRect();
  const isSelected = node === store.selected;

  return createPortal(
    <div
      style={{
        border: "1px dashed #4299e1",
        filter: `grayscale(${isSelected ? 0 : 1})`,
        height: bottom - top,
        left: left + store.contentWindow.scrollX,
        opacity: store.selected.isPreviewing ? 0 : 1,
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
    </div>,
    store.document.body
  );
});

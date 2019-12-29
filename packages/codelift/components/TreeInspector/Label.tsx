import { isValidReference } from "mobx-state-tree";
import { FunctionComponent } from "react";

import { observer, useStore } from "../../store";
import { IReactNode } from "../../models/ReactNode";

type LabelProps = {
  node: IReactNode;
};

export const Label: FunctionComponent<LabelProps> = observer(({ node }) => {
  const store = useStore();
  const isSelected = node === store.selected;

  // When HMR runs, these nodes may be removed, but still observing a previous reference
  if (!isValidReference(() => node)) {
    return null;
  }

  return (
    <button
      className={`my-1 pl-2 rounded-l text-left truncate w-full ${
        isSelected
          ? "bg-white text-black font-bold shadow-sm"
          : "text-gray-400 text-normal hover:bg-gray-800 hover:font-bold"
      }`}
      onClick={() => store.selectReactNode(node)}
      onMouseEnter={() => store.targetReactNode(node)}
      style={{ transition: "all 100ms ease-in-out" }}
    >
      {node.name}
      <small className="text-xs text-gray-600 font-normal">
        {node.element && node.element.id && `#${node.element.id}`}
        {node.element &&
          node.element.classNames.map(className => `.${className}`).join("")}
      </small>
    </button>
  );
});

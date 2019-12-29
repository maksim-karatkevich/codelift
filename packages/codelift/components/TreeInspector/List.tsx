import { isValidReference } from "mobx-state-tree";
import { FunctionComponent } from "react";

import { observer } from "../../store";
import { IReactNode } from "../../models/ReactNode";

type ListProps = {
  node: IReactNode;
};

import { Label } from "./Label";

export const List: FunctionComponent<ListProps> = observer(({ node }) => {
  // When HMR runs, these nodes may be removed, but still observing a previous reference
  if (!isValidReference(() => node)) {
    return null;
  }

  if (!node.isUserCode) {
    return (
      <>
        {node.children.map(child => (
          <List key={child.uuid} node={child} />
        ))}
      </>
    );
  }

  return (
    <ol className="border-l border-gray-800 -ml-3 pl-6">
      <li>
        <div className="flex">
          <Label node={node} />
          {/* <Menus node={node} /> */}
        </div>

        {node.children.map(child => (
          <List key={child.uuid} node={child} />
        ))}
      </li>
    </ol>
  );
});

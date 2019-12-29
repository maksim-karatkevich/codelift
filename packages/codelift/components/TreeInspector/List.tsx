import { FunctionComponent } from "react";

import { observer } from "../../store";
import { IReactNode } from "../../models/ReactNode";

type ListProps = {
  node: IReactNode;
};

import { Label } from "./Label";
import { isAlive } from "mobx-state-tree";

export const List: FunctionComponent<ListProps> = observer(({ node }) => {
  if (!isAlive(node)) {
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

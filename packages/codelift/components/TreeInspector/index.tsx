import { FunctionComponent } from "react";

import { observer, useStore } from "../../store";
import { List } from "./List";

export const TreeInspector: FunctionComponent = observer(() => {
  const store = useStore();

  if (!store.rootInstance) {
    return null;
  }

  return (
    <nav className="font-thin w-full m-auto h-full overflow-auto text-xs text-gray-400 py-2">
      <List node={store.rootInstance} />
    </nav>
  );
});

import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "../App";
import { Panel } from "../Panel";
import { Selector } from "../Selector";

import { RuleInspector } from "../RuleInspector";

export const Inspector: FunctionComponent = observer(() => {
  const store = useStore();

  if (!store.isEnabled) {
    return null;
  }

  return (
    <Panel>
      {store.target ? (
        <RuleInspector element={store.target} />
      ) : (
        <Selector onSelect={store.setTarget} />
      )}
    </Panel>
  );
});

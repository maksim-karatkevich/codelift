import React, { FunctionComponent, useState } from "react";

import { Panel } from "../Panel";
import { Selector } from "../Selector";
import { useKeyPress } from "./useKeyPress";

import { RuleInspector } from "../RuleInspector";

type InspectorProps = {
  root: HTMLElement;
};

export const Inspector: FunctionComponent<InspectorProps> = ({ root }) => {
  const [isActive, setIsActive] = useState(true);
  const [target, setTarget] = useState();

  useKeyPress(
    {
      "/": event => {
        if (!isActive) {
          event.preventDefault();
          setIsActive(true);
        }
      },

      Escape: () => {
        if (target) {
          setTarget(undefined);
        } else {
          setIsActive(false);
        }
      }
    },
    [isActive, target]
  );

  if (!isActive) {
    return null;
  }

  return (
    <Panel>
      {target ? (
        <RuleInspector element={target} />
      ) : (
        <Selector root={root} onSelect={setTarget} />
      )}
    </Panel>
  );
};

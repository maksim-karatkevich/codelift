import React, { FunctionComponent, useState } from "react";

import { Panel } from "../Panel";
import { Selector } from "../Selector";
import { useKeyPress } from "./useKeyPress";

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

  if (!target) {
    return <Selector root={root} onSelect={setTarget} />;
  }

  return (
    <Panel>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-700 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        placeholder="Search..."
      />
    </Panel>
  );
};

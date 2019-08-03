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

  return (
    <Panel>
      {target ? (
        <>
          <input
            autoFocus
            className="text-black shadow-md bg-gray-700 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
            placeholder="Search..."
          />

          <ul className="pb-2 list-reset overflow-auto">
            <li>
              <label className="shadow-inner sticky pin-t block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black">
                Current Styles
              </label>

              {/* {#each existingRules as rule (rule.selectorText)}
            <Rule {rule} on:click={toggleCurrentRule} />
          {/each} */}
            </li>

            {/* {#each groupedRules as [name, rules]}
          <li>
            <label className="shadow-inner sticky pin-t block text-sm px-2 py-1 my-2 tracking-wide bg-black">
              {name}
              <small className="float-right rounded bg-black px-1 py-px bg-gray-900">{rules.length}</small>
            </label>

            {#each rules as rule (rule.selectorText)}
              <Rule {rule} on:click={toggleCurrentRule} />
            {/each}
          </li>
        {/each} */}
          </ul>
        </>
      ) : (
        <Selector root={root} onSelect={setTarget} />
      )}
    </Panel>
  );
};

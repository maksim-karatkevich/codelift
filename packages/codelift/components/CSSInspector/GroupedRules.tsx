import React, { FunctionComponent } from "react";

import { Rule } from "./Rule";
import { observer, useStore } from "../Store";

export const GroupedRules: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <ul className="list-reset">
      {store.groupedCSSRules.map(
        ([group, groupedRules]) =>
          !!groupedRules.length && (
            <React.Fragment key={`group-${group}`}>
              <label
                key={`group-${group}`}
                className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black"
              >
                {group}

                <small className="float-right rounded bg-black px-1 py-px bg-gray-900">
                  {groupedRules.length}
                </small>
              </label>

              {groupedRules.map(rule => (
                <Rule key={`className-${rule.className}`} rule={rule} />
              ))}
            </React.Fragment>
          )
      )}
    </ul>
  );
});

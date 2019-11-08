import React, { FunctionComponent } from "react";

import { Rule } from "./Rule";
import { observer, useStore } from "../Store";

export const AppliedRules: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <ul className="list-reset">
      {!!store.appliedCSSRules.length && (
        <label
          key={"Element Styles"}
          className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black"
        >
          Element Styles
          <small className="float-right rounded bg-black px-1 py-px bg-gray-900">
            {store.appliedCSSRules.length}
          </small>
        </label>
      )}

      {store.appliedCSSRules.map(rule => (
        <Rule key={`element-${rule.className}`} rule={rule} />
      ))}
    </ul>
  );
});

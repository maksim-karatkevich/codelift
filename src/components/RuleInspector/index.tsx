import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";

import { useStore } from "../App";

import { Rule } from "./Rule";

export const RuleInspector: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-700 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        onChange={event => store.setQuery(event.target.value)}
        defaultValue={store.query}
        placeholder="Search..."
      />

      <ul className="pb-2 list-reset overflow-auto">
        <label className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black">
          Element Styles
        </label>

        {store.targetRules.map((rule: CSSStyleRule) => (
          <Rule key={rule.selectorText} rule={rule} />
        ))}

        <label className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black">
          Other Styles
        </label>

        {/* @TODO Grouped /classes */}
        {store.rules.slice(200, 215).map(rule => (
          <Rule key={rule.selectorText} rule={rule} />
        ))}
      </ul>
    </>
  );
});

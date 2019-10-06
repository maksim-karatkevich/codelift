import React, { FunctionComponent, useRef } from "react";

import { observer, useStore } from "../Store";
import { AppliedRules } from "./AppliedRules";
import { GroupedRules } from "./GroupedRules";

export const TailWindInspector: FunctionComponent = observer(() => {
  const store = useStore();
  const searchRef = useRef<HTMLInputElement>(null);

  const resetQuery = () => {
    store.resetQuery();
  };

  return (
    <>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-200 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        onChange={event => store.search(event.target.value)}
        placeholder="Search..."
        ref={searchRef}
        value={store.query}
      />

      <AppliedRules />
      <GroupedRules />
    </>
  );
});

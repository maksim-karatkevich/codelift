import React, { FunctionComponent, useEffect, useRef } from "react";

import { observer, useStore } from "../Store";
import { AppliedRules } from "./AppliedRules";
import { GroupedRules } from "./GroupedRules";

export const CSSInspector: FunctionComponent = observer(() => {
  const store = useStore();
  const searchRef = useRef<HTMLInputElement>(null);
  const className = store.target.classNames.join(" ");

  useEffect(() => {
    if (store.target.isLocked && searchRef.current) {
      searchRef.current.focus();
    }
  }, [className, store.target.isLocked]);

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

      <div className="h-full overflow-y-auto">
        <AppliedRules />
        <GroupedRules />
      </div>
    </>
  );
});

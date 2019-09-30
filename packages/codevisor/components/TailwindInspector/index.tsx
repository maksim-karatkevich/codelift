import React, { FunctionComponent, useRef } from "react";

import { useAppStore } from "../App/store";

export const TailWindInspector: FunctionComponent = () => {
  const app = useAppStore();
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-200 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        onChange={event => app.setQuery(event.target.value)}
        placeholder="Search..."
        ref={searchRef}
        value={app.query}
      />
    </>
  );
};

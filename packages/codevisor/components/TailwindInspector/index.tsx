import React, { FunctionComponent, useCallback, useRef, useState } from "react";

import { Rule } from "./Rule";
import { observer, useStore } from "../Store";
import { useSearch } from "./useSearch";

export const TailwindInspector: FunctionComponent = observer(() => {
  const store = useStore();
  const { query, target } = store;

  if (!target) {
    return null;
  }

  const { elementResults, groupedResults } = useSearch(target, query);
  const searchRef = useRef<HTMLInputElement>(null);
  const resetQuery = useCallback(() => {
    store.resetQuery();

    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  return (
    <>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-200 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        onChange={event => store.setQuery(event.target.value)}
        placeholder="Search..."
        ref={searchRef}
        value={query}
      />

      <ul className="pb-2 list-reset overflow-auto">
        {!!elementResults.length && (
          <label
            key={"Element Styles"}
            className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black"
          >
            Element Styles
            <small className="float-right rounded bg-black px-1 py-px bg-gray-900">
              {elementResults.length}
            </small>
          </label>
        )}

        {elementResults.map(({ className }) => (
          <Rule
            key={`element-${className}`}
            className={className}
            element={target}
          />
        ))}

        {Object.entries(groupedResults).map(
          ([group, groupResults]) =>
            !!groupResults.length && (
              <React.Fragment key={`group-${group}`}>
                <label
                  key={`group-${group}`}
                  className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black"
                >
                  {group}

                  <small className="float-right rounded bg-black px-1 py-px bg-gray-900">
                    {groupResults.length}
                  </small>
                </label>

                {groupResults.map(({ className }) => (
                  <Rule
                    key={`className-${className}`}
                    className={className}
                    element={target}
                    onAdd={resetQuery}
                  />
                ))}
              </React.Fragment>
            )
        )}
      </ul>
    </>
  );
});

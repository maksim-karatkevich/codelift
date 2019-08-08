import React, { FunctionComponent, useState } from "react";

import { Rule } from "./Rule";
import { useSearch } from "./useSearch";

type InspectorProps = {
  element: HTMLElement;
};

export const Inspector: FunctionComponent<InspectorProps> = ({ element }) => {
  const [query, setQuery] = useState("");
  const { elementResults, groupedResults } = useSearch(element, query);

  return (
    <>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-200 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        onChange={event => setQuery(event.target.value)}
        defaultValue={query}
        placeholder="Search..."
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
            element={element}
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
                    element={element}
                  />
                ))}
              </React.Fragment>
            )
        )}
      </ul>
    </>
  );
};

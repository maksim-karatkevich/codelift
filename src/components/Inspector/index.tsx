import React, { FunctionComponent, useState } from "react";

import { useClassNames } from "./useClassNames";
import { Rule } from "./Rule";

type InspectorProps = {
  element: HTMLElement;
};

export const Inspector: FunctionComponent<InspectorProps> = ({ element }) => {
  const [query, setQuery] = useState("");
  const { elementClassNames, groupedClassNames } = useClassNames(
    element,
    query
  );

  return (
    <>
      <input
        autoFocus
        className="text-black shadow-md bg-gray-700 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        onChange={event => setQuery(event.target.value)}
        defaultValue={query}
        placeholder="Search..."
      />

      <ul className="pb-2 list-reset overflow-auto">
        <label
          key={"Element Styles"}
          className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black"
        >
          Element Styles
        </label>

        {elementClassNames.map((className: string) => (
          <Rule
            key={`element-${className}`}
            className={className}
            element={element}
          />
        ))}

        {Object.entries(groupedClassNames).map(([group, groupClassNames]) => (
          <React.Fragment key={`group-${group}`}>
            <label
              key={`group-${group}`}
              className="shadow-inner sticky top-0 block text-sm opacity-75 px-2 py-1 my-2 tracking-wide bg-black"
            >
              {group}
            </label>

            {groupClassNames.map((className: string) => (
              <Rule
                key={`className-${className}`}
                className={className}
                element={element}
              />
            ))}
          </React.Fragment>
        ))}
      </ul>
    </>
  );
};

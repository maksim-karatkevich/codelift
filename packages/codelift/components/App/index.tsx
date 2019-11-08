import React, { FunctionComponent, useEffect } from "react";
import { createClient, Provider } from "urql";

import { useAccordion } from "../Accordion";
import { Selector } from "../Selector";
import { Sidebar } from "../Sidebar";
import { TreeInspector } from "../TreeInspector";
import { CSSInspector } from "../CSSInspector";
import { observer, useStore } from "../Store";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const store = useStore();
  const [Panel] = useAccordion();

  const { href, origin } = window.location;
  const path = href.split(origin).pop();

  return (
    <Provider value={client}>
      <Sidebar>
        {store.root ? (
          <>
            <Panel label="CSS">
              <CSSInspector />
            </Panel>

            <Panel label="DOM Tree" onToggle={() => store.unlockTarget()}>
              <TreeInspector root={store.root} />
            </Panel>

            <Panel label={<span className="font-mono">package.json</span>}>
              <input className="border rounded w-full" type="search" />
            </Panel>
          </>
        ) : store.error ? (
          <div className="bg-red-600 text-white text-center shadow">
            <p className="bg-red-600 text-white py-4 shadow">
              Add this to your app
            </p>

            <pre className="font-mono text-xs py-2 bg-red-700">
              import "codelift/register"
            </pre>
          </div>
        ) : (
          <p className="text-white text-center italic">Loading&hellip;</p>
        )}
      </Sidebar>

      {store.isOpen && <Selector />}

      <main
        className="h-screen relative bg-white"
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)"
        }}
      >
        <iframe
          onLoad={store.handleFrameLoad}
          className="w-full h-full shadow-lg"
          src={`http://localhost:3000${path}`}
          title="Source"
        />
      </main>
    </Provider>
  );
});

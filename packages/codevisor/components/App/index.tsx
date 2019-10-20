import React, { FunctionComponent, useEffect } from "react";
import { createClient, Provider } from "urql";

import { useAccordion } from "../Accordion";
import { Selector } from "../Selector";
import { Sidebar } from "../Sidebar";
import { TreeInspector } from "../TreeInspector";
import { TailWindInspector } from "../TailwindInspector";
import { observer, useStore } from "../Store";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const store = useStore();
  const [Panel] = useAccordion();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "Escape") {
        store.handleEscape();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <Provider value={client}>
      <Sidebar>
        {store.root ? (
          <>
            <Panel label="Tailwind">
              <TailWindInspector />
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
              import "codevisor/register"
            </pre>
          </div>
        ) : (
          <p className="text-white text-center italic">Loading&hellip;</p>
        )}
      </Sidebar>

      <Selector />

      <main
        className="h-screen relative"
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)"
        }}
      >
        <iframe
          onLoad={store.handleFrameLoad}
          className="w-full h-full shadow-lg"
          src="http://localhost:3000/"
          title="Source"
        />
      </main>
    </Provider>
  );
});

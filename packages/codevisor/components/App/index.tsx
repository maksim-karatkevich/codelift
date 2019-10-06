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

            <Panel label="DOM" onToggle={() => store.unlockTarget()}>
              <TreeInspector root={store.root} />
            </Panel>

            <Panel label={<span className="font-mono">package.json</span>}>
              <input className="border rounded w-full" type="search" />
            </Panel>
          </>
        ) : (
          <div className="m-4 bg-gray-700 p-4 text-center">Loading&hellip;</div>
        )}
      </Sidebar>

      <Selector />

      <main className="h-screen">
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

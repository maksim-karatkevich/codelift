import React, { FunctionComponent, useEffect } from "react";
import { createClient, Provider } from "urql";

import { useAccordion } from "../Accordion";
import { Selector } from "../Selector";
import { Sidebar } from "../Sidebar";
import { TailwindInspector as OldTailwindInspector } from "../OldTailwindInspector";
import { TreeInspector } from "../TreeInspector";
import { TailWindInspector } from "../TailwindInspector";
import { observer, useAppStore } from "./store";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const app = useAppStore();
  const [Panel] = useAccordion();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "Escape") {
        app.handleEscape();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <Provider value={client}>
      <Sidebar>
        {app.root ? (
          <>
            <Panel label="Tailwind">
              <TailWindInspector />
            </Panel>

            {app.target && app.isTargetLocked ? (
              <Panel label="Old Tailwind">
                <OldTailwindInspector />
              </Panel>
            ) : null}

            <Panel label="DOM" onToggle={() => app.unlockTarget()}>
              <TreeInspector root={app.root} />
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
          onLoad={app.handleFrameLoad}
          className="w-full h-full shadow-lg"
          src="http://localhost:3000/"
          title="Source"
        />
      </main>
    </Provider>
  );
});

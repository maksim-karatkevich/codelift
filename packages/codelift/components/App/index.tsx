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
      {/* <Sidebar>
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
      </Sidebar> */}

      {store.isOpen && <Selector />}

      <section
        className="bg-gray-100"
        style={{
          display: "grid",
          gridTemplateColumns: "16rem 1fr 16rem"
        }}
      >
        <aside>
          <h1
            className="px-4 py-4 text-xl font-serif tracking-wider text-teal-700 font-thin"
            style={{
              textShadow: "0 1px 0 #FFFFFF, 0 -1px 0 #00000020"
            }}
          >
            code<em className="ml-px opacity-75">lift</em>
          </h1>

          <form className="flex items-center bg-transparent border border-gray-400 bg-white focus:shadow-outline rounded-lg px-2 py-1">
            <input
              className="appearance-none w-full"
              placeholder="Filter..."
              type="search"
            />
            <button>Howdy</button>
          </form>
        </aside>

        <section className="pt-4 h-screen">
          <main
            className="h-full relative bg-white rounded-t overflow-hidden"
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
        </section>

        <aside>Panels</aside>
      </section>
    </Provider>
  );
});

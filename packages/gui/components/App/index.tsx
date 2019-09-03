import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { createClient, Provider } from "urql";

import { useAccordion } from "../Accordion";
import { Inspector } from "../Inspector";
import { Selector } from "../Selector";
import { Sidebar } from "../Sidebar";

const client = createClient({
  url: "/api"
});

export const App: FunctionComponent = () => {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [target, setTarget] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [root, setRoot] = useState();
  const [Panel] = useAccordion();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    document.domain = "localhost";

    if (iframe && iframe.current && iframe.current.contentWindow) {
      setRoot(iframe.current.contentWindow.document.querySelector("body"));
    }
  }, [isLoaded]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "Escape" && target) {
        setTarget(undefined);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [target]);

  return (
    <Provider value={client}>
      <Sidebar>
        {root ? (
          <>
            <Panel label="Tailwind">
              <Selector onSelect={setTarget} root={root} />
            </Panel>
            <Panel label={<span className="font-mono">package.json</span>}>
              There
            </Panel>
          </>
        ) : (
          <div className="m-4 bg-gray-700 p-4 text-center">Loading&hellip;</div>
        )}
      </Sidebar>

      <main className="h-screen">
        <iframe
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full shadow-lg"
          ref={iframe}
          src="http://localhost:3000/"
          title="Source"
        />
      </main>
    </Provider>
  );
};

import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import { createClient, Provider } from "urql";

import { useAccordion } from "../Accordion";
import { Selector } from "../Selector";
import { Sidebar } from "../Sidebar";
import { TailwindInspector } from "../TailwindInspector";
import { TreeInspector } from "../TreeInspector";

const client = createClient({
  url: "/api"
});

export const App: FunctionComponent = () => {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [target, setTarget] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [root, setRoot] = useState();
  const [Panel] = useAccordion();

  const handleHover = useCallback(
    element => {
      if (!isSelected) {
        setTarget(element);
      }
    },
    [isSelected]
  );

  const handleSelect = useCallback(() => setIsSelected(true), []);

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

      // TODO This is a state machine.
      if (key === "Escape") {
        if (isSelected) {
          setIsSelected(false);
        } else {
          setIsSelected(false);
          setTarget(undefined);
        }
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
            {isSelected && target ? (
              <Panel label="Tailwind">
                <TailwindInspector element={target} />
              </Panel>
            ) : null}

            <Panel label="DOM" onToggle={() => setIsSelected(false)}>
              <TreeInspector
                onHover={handleHover}
                onSelect={handleSelect}
                root={root}
                target={target}
              />
            </Panel>

            <Panel label={<span className="font-mono">package.json</span>}>
              <input className="border rounded w-full" type="search" />
            </Panel>
          </>
        ) : (
          <div className="m-4 bg-gray-700 p-4 text-center">Loading&hellip;</div>
        )}
      </Sidebar>

      {root && (
        <Selector
          onHover={handleHover}
          onSelect={handleSelect}
          root={root}
          target={target}
        />
      )}

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

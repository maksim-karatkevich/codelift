import React, { FunctionComponent, useEffect, useRef, useState } from "react";

import { Inspector } from "../Inspector";
import { Panel } from "../Panel";
import { Selector } from "../Selector";

export const App: FunctionComponent = () => {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [target, setTarget] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [root, setRoot] = useState();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    document.domain = "localhost";

    // @ts-ignore
    setRoot(iframe.current.contentWindow.document.querySelector("body"));
  }, [isLoaded]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "/" && !isEnabled) {
        event.preventDefault();

        return setIsEnabled(true);
      }

      if (key === "Escape") {
        target ? setTarget(undefined) : setIsEnabled(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isEnabled, target]);

  return (
    <>
      {isEnabled ? (
        <Panel>
          {target ? (
            <Inspector element={target} />
          ) : root ? (
            <Selector onSelect={setTarget} root={root} />
          ) : (
            <div className="m-4 bg-gray-700 p-4 text-center">
              Loading&hellip;
            </div>
          )}
        </Panel>
      ) : null}

      <iframe
        onLoad={() => setIsLoaded(true)}
        className="w-full h-screen"
        ref={iframe}
        src="http://localhost:3000/"
        title="Source"
      />
    </>
  );
};

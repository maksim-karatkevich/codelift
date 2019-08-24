import React, { FunctionComponent, useEffect, useState } from "react";

import { Inspector } from "../Inspector";
import { Panel } from "../Panel";
import { Selector } from "../Selector";

type AppProps = {
  defaultEnabled?: boolean;
  defaultTarget?: HTMLElement;
  root?: HTMLElement;
};

export const App: FunctionComponent<AppProps> = ({
  defaultEnabled = true,
  defaultTarget,
  root = document.querySelector("#root") as HTMLElement
}) => {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const [target, setTarget] = useState(defaultTarget);

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

  if (!isEnabled) {
    return null;
  }

  return (
    <Panel>
      {target ? (
        <Inspector element={target} />
      ) : (
        <Selector onSelect={setTarget} root={root} />
      )}
    </Panel>
  );
};

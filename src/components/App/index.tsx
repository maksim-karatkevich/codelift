import { useMachine } from "@xstate/react";
import React, { FunctionComponent, useEffect } from "react";

import { Inspector } from "../Inspector";
import { machine } from "./machine";
import { Panel } from "../Panel";
import { Selector } from "../Selector";

type AppProps = {
  root?: HTMLElement;
};

export const App: FunctionComponent<AppProps> = ({
  root = document.querySelector("#root") as HTMLElement
}) => {
  const [current, send] = useMachine(machine);
  const target = (current.context.target as unknown) as HTMLElement;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "/" && current.matches("hidden")) {
        event.preventDefault();
        send("SHOW");
      } else if (key === "Escape") {
        send("CANCEL");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [current, send]);

  if (current.matches("hidden")) {
    return null;
  }

  return (
    <Panel>
      {current.matches("inspecting") ? (
        <Inspector element={target} />
      ) : (
        <Selector onSelect={target => send("SELECT", { target })} root={root} />
      )}
    </Panel>
  );
};

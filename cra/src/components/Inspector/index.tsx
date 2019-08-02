import React, { FunctionComponent, useEffect, useState } from "react";
import { Selector } from "../Selector";
import { useKeyPress } from "./useKeyPress";

type InspectorProps = {
  root: HTMLElement;
};

export const Inspector: FunctionComponent<InspectorProps> = ({ root }) => {
  const [isActive, setIsActive] = useState(true);
  const [target, setTarget] = useState();

  useKeyPress(
    {
      "/": event => {
        if (!isActive) {
          event.preventDefault();
          setIsActive(true);
        }
      },

      Escape: () => {
        if (target) {
          setTarget(undefined);
        } else {
          setIsActive(false);
        }
      }
    },
    [isActive, target]
  );

  useEffect(() => {
    const html = document.documentElement;

    html.style.transition = "margin-left 0.2s";

    if (target) {
      html.classList.add("ml-64");
    } else {
      html.classList.remove("ml-64");
    }
  }, [target]);

  if (!isActive) {
    return null;
  }

  if (!target) {
    return (
      <Selector
        root={root}
        onSelect={element => {
          // setIsActive(true);
          setTarget(element);
        }}
      />
    );
  }

  return (
    <div
      className="w-64 z-50 fixed top-0 shadow-lg min-h-screen bg-gray-800 text-white"
      style={{
        left: target ? 0 : "-16em",
        transition: "left 0.2s"
      }}
    >
      <input
        autoFocus
        className="text-black shadow-md bg-gray-700 focus:bg-white border-transparent focus:border-blue-light p-2 static w-full"
        placeholder="Search..."
      />
    </div>
  );
};

import { DependencyList, useEffect } from "react";

type KeysToCallbacks = {
  [key: string]: (event: KeyboardEvent) => void;
};

export const useKeyPress = (
  keysToCallbacks: KeysToCallbacks,
  deps: DependencyList
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const callback = keysToCallbacks[key];

      if (callback) {
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });
};

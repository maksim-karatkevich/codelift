import { useEffect } from "react";
import { Portal } from "./Portal";
import { observer, useStore } from "../Store";

export const Selector = observer(() => {
  const store = useStore();
  const { root } = store;

  useEffect(() => {
    if (!root) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      store.selected.set(event.target as HTMLElement);
      store.target.unset();
    };

    const handleHover = (event: MouseEvent) => {
      store.target.set(event.target as HTMLElement);
    };

    // When nothing is selected, allow the user to click to choose.
    // Otherwise, target is only set by the TreeInspector
    if (!store.selected.element) {
      root.addEventListener("mousemove", handleHover);
    }

    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleHover);
    };
  }, [root, store.selected.element]);

  return (
    <>
      <Portal key="selected" node={store.selected} />
      <Portal key="target" node={store.target} />
    </>
  );
});

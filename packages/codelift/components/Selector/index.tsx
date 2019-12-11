import { useEffect } from "react";
import { Portal } from "./Portal";
import { observer, useStore } from "../../store";

export const Selector = observer(() => {
  const store = useStore();
  const { root } = store;

  useEffect(() => {
    if (!root) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();

      const node = store.findElementNode(event.target as HTMLElement);

      if (node) {
        store.selectNode(node);
        store.clearTarget();
      }
    };

    const handleHover = (event: MouseEvent) => {
      const node = store.findElementNode(event.target as HTMLElement);

      if (node) {
        store.targetNode(node);
      }
    };

    // When nothing is selected, allow the user to click to choose.
    // Otherwise, target is only set by the TreeInspector
    if (!store.selected) {
      root.addEventListener("mousemove", handleHover);
    }

    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleHover);
    };
  }, [root, store.selected]);

  return (
    <>
      {store.selected && <Portal key="selected" node={store.selected} />}
      {store.target && <Portal key="target" node={store.target} />}
    </>
  );
});

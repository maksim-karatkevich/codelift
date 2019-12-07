import { Portal } from "./Portal";
import { useStore } from "../Store";

export const Selector = () => {
  const store = useStore();

  return (
    <>
      <Portal key="target" node={store.target} />
      <Portal key="selected" node={store.selected} />
    </>
  );
};

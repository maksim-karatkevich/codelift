import { useState } from "react";
import { useStore, observer } from "../../store";

export const ComponentInspector = observer(() => {
  const store = useStore();
  const Inspector = store.selected?.instance.type.Inspector;

  if (Inspector) {
    // ! This is britle dependency injection, as any hooks outside of
    // ! the Inspector's scope (e.g. `useQuery`) won't share this React instance.
    return <Inspector useState={useState} />;
  }

  return <div>No Inspector</div>;
});

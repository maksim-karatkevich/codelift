import { useStore, observer } from "../../store";

export const ComponentInspector = observer(() => {
  const store = useStore();

  console.log(store.selected?.instance.type);

  return <div>Howdy</div>;
});

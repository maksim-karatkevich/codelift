import { FunctionComponent } from "react";

import { observer, useStore } from "../Store";

type Props = {
  root: HTMLElement;
};

export const TreeInspector: FunctionComponent<Props> = observer(({ root }) => {
  const store = useStore();
  const children = [...root.children] as HTMLElement[];
  const tagName = root.tagName.toLowerCase();
  const isSelfClosing = children.length === 0;
  const handleClick = () => store.handleTargetSelect(root);
  const handleMouseEnter = () => store.handleTargetHover(root);

  return (
    <ol
      className="text-white font-mono text-xs pl-3 overflow-y-auto shadow"
      style={{
        background: "rgba(100%, 100%, 100%, 0.05)"
      }}
    >
      <li
        className={`cursor-pointer ${
          root === store.target.element ? "text-yellow-500" : undefined
        }`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        {isSelfClosing ? `<${tagName}/>` : `<${tagName}>`}
      </li>

      {root instanceof SVGElement || isSelfClosing ? null : (
        <>
          {children.map((child, i) => (
            <TreeInspector key={i} root={child} />
          ))}

          <li
            className={`cursor-pointer py-1 ${
              root === store.target.element ? "text-yellow-500" : undefined
            }`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
          >
            {`</${tagName}>`}
          </li>
        </>
      )}
    </ol>
  );
});

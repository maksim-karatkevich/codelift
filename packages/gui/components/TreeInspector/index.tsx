import { FunctionComponent, useCallback } from "react";

type Props = {
  onHover: (target: HTMLElement) => void;
  onSelect: (target: HTMLElement) => void;
  root: HTMLElement;
  target?: HTMLElement;
};

export const TreeInspector: FunctionComponent<Props> = ({
  onHover,
  onSelect,
  root,
  target
}) => {
  const children = [...root.children] as HTMLElement[];
  const tagName = root.tagName.toLowerCase();
  const isSelfClosing = children.length === 0;
  const handleClick = useCallback(() => onSelect(root), [onSelect, root]);
  const handleMouseEnter = useCallback(() => onHover(root), [onHover, root]);

  return (
    <ol
      className="text-white font-mono text-xs pl-3 overflow-y-auto shadow"
      style={{
        background: "rgba(100%, 100%, 100%, 0.05)"
      }}
    >
      <li
        className={`cursor-pointer ${
          root === target ? "text-yellow-500" : undefined
        }`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        {isSelfClosing ? `<${tagName}/>` : `<${tagName}>`}
      </li>

      {root instanceof SVGElement || isSelfClosing ? null : (
        <>
          {children.map((child, i) => (
            <TreeInspector
              key={i}
              onHover={onHover}
              onSelect={onSelect}
              root={child}
              target={target}
            />
          ))}

          <li
            className={`cursor-pointer py-1 ${
              root === target ? "text-yellow-500" : undefined
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
};

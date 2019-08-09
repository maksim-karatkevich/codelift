import React, { FunctionComponent, useCallback } from "react";

type TreeProps = {
  onHover: (target: HTMLElement) => void;
  onSelect: (target: HTMLElement) => void;
  root: HTMLElement;
  target: HTMLElement;
};

export const Tree: FunctionComponent<TreeProps> = ({
  onHover,
  root,
  onSelect,
  target
}) => {
  const children = [...root.children] as HTMLElement[];
  const tagName = root.tagName.toLowerCase();
  const isSelfClosing = children.length === 0;
  const handleClick = useCallback(() => onSelect(root), [root]);
  const handleMouseEnter = useCallback(() => onHover(root), [root]);

  return (
    <ol
      className="font-mono text-xs border-l border-gray-700 pl-3 overflow-y-auto"
      style={{
        background: "rgba(0, 0, 0, 0.05)"
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
            <Tree
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

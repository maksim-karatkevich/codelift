import { Button, List, ListItem, Text } from "@chakra-ui/core";
import { isAlive } from "mobx-state-tree";
import { FunctionComponent, MouseEvent, useCallback } from "react";
import { observer, useStore } from "../../store";

import { IElementNode } from "../../models/ElementNode";

type TreeListProps = {
  depth?: number;
  filter?: string;
  node: IElementNode;
};

export const TreeList: FunctionComponent<TreeListProps> = observer(
  ({ depth = 0, node }) => {
    const store = useStore();
    const handleMouseEnter = useCallback(
      (event: MouseEvent) => {
        node.element.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        store.targetNode(node);
      },
      [node]
    );

    if (!isAlive(node)) {
      return null;
    }

    // Don't allow navigation to these tags
    if (
      ["com-1password-op-button", "noscript", "script", "style"].includes(
        node.tagName
      )
    ) {
      return null;
    }

    return (
      <List
        as="ol"
        borderLeft="1px"
        borderColor="gray.600"
        fontFamily="mono"
        marginLeft={depth ? 3 : 0}
      >
        <ListItem>
          <Button
            onClick={() => store.selectNode(node)}
            onMouseEnter={handleMouseEnter}
            fontSize="xs"
            fontWeight="lighter"
            height="1.5rem"
            rounded="0"
            size="sm"
            variant={
              node.isSelected ? "outline" : node.isTargeted ? "solid" : "ghost"
            }
            verticalAlign="text-bottom"
          >
            <Text key="node-tagName">{node.tagName}</Text>

            {node.id && (
              <Text color="gray.400" fontSize="75%" key="node-id" isTruncated>
                #{node.id}
              </Text>
            )}

            {node.classNames.length > 0 && (
              <Text
                color="gray.400"
                fontSize="75%"
                key="node-classNames"
                isTruncated
              >
                .{node.classNames.join(".")}
              </Text>
            )}
          </Button>

          {/* Block traversal further */}
          {/* TODO This should be blocked on hover as well to target the SVG, and not path/g */}
          {["svg"].includes(node.tagName)
            ? null
            : node.childNodes.map(childNode => (
                <TreeList
                  depth={depth + 1}
                  key={childNode.uuid}
                  node={childNode}
                />
              ))}
        </ListItem>
      </List>
    );
  }
);

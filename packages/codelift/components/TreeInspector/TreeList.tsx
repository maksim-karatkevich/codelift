import { Button, List, ListItem, Text } from "@chakra-ui/core";
import { FunctionComponent, MouseEvent, useCallback } from "react";
import { observer, useStore } from "../../store";

import { INode } from "../../models/Node";

type TreeListProps = {
  depth?: number;
  filter?: string;
  node: INode;
};

export const TreeList: FunctionComponent<TreeListProps> = observer(
  ({ depth = 0, node }) => {
    const store = useStore();
    const { classNames, id, tagName } = node;
    const handleClick = useCallback(() => {
      store.selectNode(node);
    }, [node]);
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

    // Don't allow navigation to these tags
    if (
      ["com-1password-op-button", "noscript", "script", "style"].includes(
        tagName
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
            onClick={handleClick}
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
            <Text>{tagName}</Text>

            {id && (
              <Text color="gray.400" fontSize="75%" isTruncated>
                #{id}
              </Text>
            )}

            {classNames.length > 0 && (
              <Text color="gray.400" fontSize="75%" isTruncated>
                .{classNames.join(".")}
              </Text>
            )}
          </Button>

          {/* Block traversal further */}
          {/* TODO This should be blocked on hover as well to target the SVG, and not path/g */}
          {["svg"].includes(tagName)
            ? null
            : node.childNodes.map((childNode, i) => (
                <TreeList depth={depth + 1} key={i} node={childNode} />
              ))}
        </ListItem>
      </List>
    );
  }
);

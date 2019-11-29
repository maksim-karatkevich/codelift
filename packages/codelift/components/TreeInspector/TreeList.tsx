import { Button, List, ListItem, Text } from "@chakra-ui/core";
import { FunctionComponent, useCallback, MouseEvent } from "react";

import { observer, useStore } from "../Store";

type TreeListProps = {
  depth?: number;
  filter?: string;
  root: HTMLElement;
};

export const TreeList: FunctionComponent<TreeListProps> = observer(
  ({ depth = 0, root }) => {
    const store = useStore();
    const children = [...root.children] as HTMLElement[];
    const tagName = root.tagName.toLowerCase();
    const handleClick = useCallback(() => store.handleTargetSelect(root), [
      root
    ]);
    const handleMouseEnter = useCallback(
      (event: MouseEvent) => {
        root.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        store.handleTargetHover(root);
      },
      [root]
    );

    const classNames = [...root.classList];

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
            variant={store.target.element === root ? "solid" : "ghost"}
            verticalAlign="text-bottom"
          >
            <Text>{tagName}</Text>

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
            : children.map((child, i) => (
                <TreeList depth={depth + 1} key={i} root={child} />
              ))}
        </ListItem>
      </List>
    );
  }
);

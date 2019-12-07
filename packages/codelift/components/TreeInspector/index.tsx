import { Box } from "@chakra-ui/core";
import { FunctionComponent, useCallback } from "react";
import { observer, useStore } from "../Store";
import { TreeList } from "./TreeList";

export const TreeInspector: FunctionComponent = observer(() => {
  const store = useStore();

  const handleMouseLeave = useCallback(() => {
    store.target.unset();
  }, [store.root]);

  if (!store.root) {
    return null;
  }

  // Ignore root, since it has no `_debugSource`
  const children = [...store.root.children] as HTMLElement[];

  return (
    <>
      {/* TODO Re-enable and filter through Node models  */}
      {/* e..g node.matchesFilter(filter), node.childrenMatchesFilter(filter) */}
      {/* <InputGroup>
        <Input
          color="white"
          placeholder="Filter DOM..."
          px="2"
          variant="flushed"
        />
        <InputRightElement>
          <IconButton aria-label="Search" icon="search" variant="ghost" />
        </InputRightElement>
      </InputGroup> */}

      <Box
        paddingY="2"
        height="100%"
        onMouseLeave={handleMouseLeave}
        overflow="auto"
        width="100%"
      >
        {children.map((child, i) => (
          <TreeList key={i} root={child} />
        ))}
      </Box>
    </>
  );
});

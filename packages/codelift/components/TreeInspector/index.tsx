import { Box } from "@chakra-ui/core";
import { FunctionComponent, useCallback } from "react";

import { observer, useStore } from "../../store";
import { TreeList } from "./TreeList";

export const TreeInspector: FunctionComponent = observer(() => {
  const store = useStore();

  const handleMouseLeave = useCallback(() => {
    store.clearTarget();
  }, [store.root]);

  if (!store.root) {
    return null;
  }

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
        {store.nodes.map((node, i) => (
          <TreeList key={i} node={node} />
        ))}
      </Box>
    </>
  );
});

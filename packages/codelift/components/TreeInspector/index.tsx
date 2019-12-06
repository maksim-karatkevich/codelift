import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/core";
import { ChangeEvent, FunctionComponent, useCallback, useState } from "react";

import { observer, useStore } from "../Store";

import { Selector } from "../Selector";
import { TreeList } from "./TreeList";

export const TreeInspector: FunctionComponent = observer(() => {
  const store = useStore();

  const handleMouseLeave = useCallback(() => {
    store.target.unset();
  }, [store.root]);

  if (!store.root) {
    return null;
  }

  return (
    <>
      {store.isOpen && <Selector node={store.target} />}

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
        <TreeList root={store.root} />
      </Box>
    </>
  );
});

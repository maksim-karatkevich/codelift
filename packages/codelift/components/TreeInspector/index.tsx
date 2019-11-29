import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/core";
import { FunctionComponent, useState, ChangeEvent } from "react";

import { observer, useStore } from "../Store";

import { TreeList } from "./TreeList";

export const TreeInspector: FunctionComponent = observer(() => {
  const store = useStore();

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

      <Box paddingY="2" maxHeight="100%" overflow="auto" width="100%">
        <TreeList root={store.root} />
      </Box>
    </>
  );
});

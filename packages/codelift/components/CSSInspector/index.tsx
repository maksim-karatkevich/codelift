import {
  Box,
  Input,
  IconButton,
  InputGroup,
  InputRightElement,
  List
} from "@chakra-ui/core";
import React, {
  FunctionComponent,
  useEffect,
  useRef,
  ChangeEvent
} from "react";

import { observer, useStore } from "../Store";
import { AppliedRules } from "./AppliedRules";
import { GroupedRules } from "./GroupedRules";

export const CSSInspector: FunctionComponent = observer(() => {
  const store = useStore();
  const searchRef = useRef<HTMLInputElement>(null);
  const className = store.target.classNames.join(" ");

  useEffect(() => {
    if (store.target.isLocked && searchRef.current) {
      searchRef.current.focus();
    }
  }, [className, store.target.isLocked]);

  return (
    <>
      <InputGroup>
        <Input
          autoFocus
          bg="white"
          boxShadow="md"
          color="black"
          onChange={(event: ChangeEvent) =>
            store.search((event.target as HTMLInputElement).value)
          }
          ref={searchRef}
          placeholder="Search..."
          px="2"
          value={store.query}
          variant="flushed"
        />
        <InputRightElement>
          <IconButton aria-label="Search" icon="search" variant="ghost" />
        </InputRightElement>
      </InputGroup>

      <List maxHeight="100%" overflow="auto" width="100%">
        <AppliedRules />
        <GroupedRules />
      </List>
    </>
  );
});

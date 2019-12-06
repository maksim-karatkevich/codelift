import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List
} from "@chakra-ui/core";
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useRef
} from "react";
import { observer, useStore } from "../Store";
import { AppliedRules } from "./AppliedRules";
import { GroupedRules } from "./GroupedRules";

export const CSSInspector: FunctionComponent = observer(() => {
  const store = useStore();
  const searchRef = useRef<HTMLInputElement>(null);
  const className = store.selected.classNames.join(" ");

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [className]);

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

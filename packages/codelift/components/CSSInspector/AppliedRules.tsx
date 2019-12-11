import { ListItem, Tag } from "@chakra-ui/core";
import React, { FunctionComponent } from "react";
import { observer, useStore } from "../../store";
import { Rule } from "./Rule";

export const AppliedRules: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <>
      {!!store.appliedCSSRules.length && (
        <ListItem
          bg="gray.800"
          boxShadow="sm"
          color="white"
          key={"Applied Classes"}
          fontSize="sm"
          paddingY="1"
          paddingX="2"
          position="sticky"
        >
          Applied Classes
          <Tag
            className="float-right rounded bg-black px-1 py-px bg-gray-900"
            float="right"
            rounded="full"
            size="sm"
          >
            {store.appliedCSSRules.length}
          </Tag>
        </ListItem>
      )}

      {store.appliedCSSRules.map(rule => (
        <Rule key={`element-${rule.className}`} rule={rule} />
      ))}
    </>
  );
});

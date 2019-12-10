import { ListItem, Tag } from "@chakra-ui/core";
import React, { FunctionComponent } from "react";
import { observer, useStore } from "../../store";
import { Rule } from "./Rule";

export const GroupedRules: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <>
      {store.groupedCSSRules.map(
        ([group, groupedRules]) =>
          !!groupedRules.length && (
            <React.Fragment key={`group-${group}`}>
              <ListItem
                bg="gray.800"
                boxShadow="sm"
                color="white"
                key={`group-${group}`}
                fontSize="sm"
                paddingY="1"
                paddingX="2"
                position="sticky"
              >
                {group}
                <Tag float="right" fontSize="xs" rounded="full" size="sm">
                  {groupedRules.length}
                </Tag>
              </ListItem>

              {groupedRules.map(rule => (
                <Rule key={`className-${rule.className}`} rule={rule} />
              ))}
            </React.Fragment>
          )
      )}
    </>
  );
});

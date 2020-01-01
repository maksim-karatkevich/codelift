import { ListItem, Text } from "@chakra-ui/core";
import { FunctionComponent } from "react";
import { useMutation } from "urql";

import { observer, useStore } from "../../store";
import { ICSSRule } from "../../models/CSSRule";

type RuleProps = {
  rule: ICSSRule;
};

export const Rule: FunctionComponent<RuleProps> = observer(({ rule }) => {
  const store = useStore();
  const [res, toggleClassName] = useMutation(`
    mutation ToggleClassName(
      $className: String!
      $fileName: String!
      $lineNumber: Int!
      ) {
        toggleClassName(
          className: $className
          fileName: $fileName
          lineNumber: $lineNumber
        )
      }
  `);

  if (res.error) {
    console.error(res.error);

    throw new Error(res.error.toString());
  }

  const toggleRule = (rule: ICSSRule) => {
    if (!store.selected) {
      return console.warn("Cannot apply rule without an element selected");
    }

    const { element } = store.selected;

    if (!element) {
      return console.warn(
        "Selected node does not have an element associated with it",
        store.selected
      );
    }

    const { className } = rule;
    const { debugSource } = element;

    if (!debugSource) {
      const error = new Error(
        "Selected element is missing _debugSource property"
      );

      console.error(error, element);
      throw error;
    }

    toggleClassName({ ...debugSource, className });

    element.applyRule(rule);
    store.resetQuery();
  };

  return (
    // @ts-ignore
    <ListItem
      cursor="pointer"
      fontFamily="mono"
      fontWeight="hairline"
      fontSize="xs"
      onClick={() => toggleRule(rule)}
      onMouseEnter={() => {
        if (store.selected && store.selected.element) {
          store.selected.element.previewRule(rule);
        }
      }}
      onMouseLeave={() => {
        store.selected?.element?.cancelPreview();
      }}
      paddingX="2"
      paddingY="1"
      // @ts-ignore
      _hover={{
        bg: "gray.600"
      }}
    >
      <Text color={rule.isApplied ? "white" : "gray.400"}>
        {rule.className}
      </Text>
    </ListItem>
  );
});

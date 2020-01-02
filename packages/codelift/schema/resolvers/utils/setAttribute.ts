import { IParser, parser } from "./parser";

import { findAttribute } from "./findAttribute";

export const setAttribute = (
  node: IParser,
  name: string,
  value: string | null = null
): string | null => {
  const attribute = findAttribute(node, name).at(0);
  let [path] = attribute.paths();

  if (!path) {
    const [parentPath] = node.paths();

    parentPath.value.attributes.push(
      parser.jsxAttribute(
        parser.jsxIdentifier("className"),
        parser.stringLiteral("")
      )
    );

    return setAttribute(node, name, value);
  }

  if (!value) {
    path.prune();

    return null;
  }

  path.value.value = parser.stringLiteral(value);

  return value;
};

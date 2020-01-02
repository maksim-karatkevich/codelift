import { IParser, parser } from "./parser";

export const findAttribute = (
  node: IParser,
  name: string,
  type: string = "JSXIdentifier"
) => {
  const nodes = node.find(parser.JSXAttribute, {
    name: {
      name,
      type
    }
  });

  return nodes.at(0);
};

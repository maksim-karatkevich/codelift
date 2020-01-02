import { readFileSync, writeFileSync } from "fs";

import { getNodeAt } from "./utils/getNodeAt";
import { findAttribute } from "./utils/findAttribute";
import { parser } from "./utils/parser";
import { setAttribute } from "./utils/setAttribute";

export const resolvers = {
  Mutation: {
    toggleClassName(
      _: any,
      args: {
        className: string;
        fileName: string;
        lineNumber: number;
      }
    ) {
      const { className, fileName, lineNumber } = args;
      const ast = parser(readFileSync(fileName, "utf8"));
      const node = getNodeAt(ast, lineNumber);
      const attribute = findAttribute(node, "className");
      const [path] = attribute.paths();

      if (!path) {
        return resolvers.Mutation.updateClassName(_, args);
      }

      const literal = path.value.value;

      if (!literal) {
        const error = new Error("className has no value");

        console.error(error, path);
        throw error;
      }

      if (literal.type !== "StringLiteral") {
        const error = new Error(`TODO - Support literal ${literal.type}`);

        console.error(error, literal);
        throw error;
      }

      const classNames = new Set(
        literal.value
          .split(" ")
          .map(className => className.trim())
          .filter(Boolean)
      );

      if (classNames.has(className)) {
        classNames.delete(className);
      } else {
        classNames.add(className);
      }

      const value = setAttribute(
        node,
        "className",
        Array.from(classNames)
          .sort()
          .join(" ")
      );

      writeFileSync(fileName, ast.toSource(), "utf8");

      return value;
    },

    updateClassName(
      _: any,
      args: {
        className: string;
        fileName: string;
        lineNumber: number;
      }
    ) {
      const { className, fileName, lineNumber } = args;
      const ast = parser(readFileSync(fileName, "utf8"));
      const node = getNodeAt(ast, lineNumber);

      const value = setAttribute(node, "className", className);
      writeFileSync(fileName, ast.toSource(), "utf8");

      return value;
    }
  },

  Query: {
    version() {
      return require("../../package.json").version;
    }
  }
};

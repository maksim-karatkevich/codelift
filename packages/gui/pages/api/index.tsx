import { ApolloServer, gql } from "apollo-server-micro";
import { readFileSync, writeFileSync } from "fs";
import jscodeshift from "jscodeshift";

// This is the one we need to use to parse source code
// ? Should this change by extension
const j = jscodeshift.withParser("tsx");

const typeDefs = gql`
  type Mutation {
    toggleClassName(
      className: String!
      fileName: String!
      lineNumber: Int!
    ): String
  }

  type Query {
    version: String!
  }
`;

const resolvers = {
  Mutation: {
    toggleClassName(
      _: any,
      args: {
        className: string;
        fileName: string;
        lineNumber: number;
      }
    ) {
      let updatedClassName;

      const { className, fileName, lineNumber } = args;
      const source = readFileSync(fileName, "utf8");
      const ast = j(source);
      const nodes = ast.find(j.JSXOpeningElement).filter(path => {
        return Boolean(
          path.value.loc && path.value.loc.start.line === lineNumber
        );
      });

      if (!nodes.length) {
        throw new Error(
          `Could not find JSX component at ${fileName}:${lineNumber}`
        );
      }

      nodes.forEach(path => {
        const classNameAttributes = j(path).find(j.JSXAttribute, {
          name: {
            name: "className",
            type: "JSXIdentifier"
          }
        });

        // <Component /> does not have a `className`
        if (classNameAttributes.size() === 0) {
          path.value.attributes.push(
            j.jsxAttribute(
              j.jsxIdentifier("className"),
              j.stringLiteral(className)
            )
          );

          updatedClassName = className;

          return;
        }

        classNameAttributes.forEach(classNameAttribute => {
          const literal = classNameAttribute.value.value;

          if (!literal) {
            throw new Error(`className has no value`);
          }

          if (literal.type !== "StringLiteral") {
            const error = new Error(`TODO - Support literal ${literal.type}`);
            console.error(error, literal);

            throw error;
          }

          // Toggle class
          const previousClassNames = literal.value
            .split(" ")
            .map(className => className.trim())
            .filter(Boolean);

          // Toggle className within list of classes
          const nextClassNames = previousClassNames.includes(className)
            ? previousClassNames.filter(
                otherClassName => otherClassName !== className
              )
            : previousClassNames.concat(className);

          literal.value = nextClassNames.join(" ");

          // Remove empty `className`
          if (literal.value) {
            updatedClassName = literal.value;
          } else {
            classNameAttribute.prune();
          }
        });
      });

      writeFileSync(fileName, ast.toSource(), "utf8");

      return updatedClassName;
    }
  },

  Query: {
    version() {
      return require("../../package.json").version;
    }
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({ path: "/api" });

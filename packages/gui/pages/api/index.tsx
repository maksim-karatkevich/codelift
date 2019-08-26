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
    ): String!
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

      const output = j(source)
        .find(j.JSXOpeningElement)
        .forEach((path, i) => {
          if (path.value.loc) {
            if (path.value.loc.start.line === lineNumber) {
              const jsxAttributes = j(path).find(j.JSXAttribute, {
                name: {
                  name: "className",
                  type: "JSXIdentifier"
                }
              });

              if (jsxAttributes.size() === 0) {
                throw new Error("TODO - Create className attribute");
              } else {
                jsxAttributes.forEach(jsxAttributePath => {
                  const literal = jsxAttributePath.value.value;

                  // Toggle class
                  if (literal && literal.type === "StringLiteral") {
                    const classNames = literal.value
                      .split(" ")
                      .map(className => className.trim())
                      .filter(Boolean);

                    // Toggle className within list of classes
                    const classList = classNames.includes(className)
                      ? classNames.filter(
                          otherClassName => otherClassName !== className
                        )
                      : classNames.concat(className);

                    updatedClassName = classList.join(" ");

                    literal.value = updatedClassName;
                  } else {
                    const error = new Error(`TODO - Support literal`);
                    console.error(error, literal);
                    throw error;
                  }
                });
              }
            }
          }
        })
        .toSource();

      writeFileSync(fileName, output, "utf8");

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

import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Mutation {
    """
    Add/remove the provided className from the Component
    """
    toggleClassName(
      """
      className to toggle within the attribute string
      """
      className: String!
      """
      element._reactInstance._debugSource.fileName
      """
      fileName: String!
      """
      element._reactInstance._debugSource.lineNumber
      """
      lineNumber: Int!
    ): String

    """
    Replace or remove the Component's className
    """
    updateClassName(
      """
      Entire className attribute (null to remove)
      """
      className: String
      """
      element._reactInstance._debugSource.fileName
      """
      fileName: String!
      """
      element._reactInstance._debugSource.lineNumber
      """
      lineNumber: Int!
    ): String
  }

  type Query {
    version: String!
  }
`;

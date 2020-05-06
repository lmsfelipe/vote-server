const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  input UserInputData {
    name: String!
    email: String!
    password: String!
  }

  type AuthData {
    userId: ID!
    token: String!
  }
`;

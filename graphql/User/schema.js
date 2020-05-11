const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Mutation {
    createUser(userInput: UserInputData): User!
    editUser(id: ID!, userInput: UserInputData): User!
  }

  extend type Query {
    login(email: String!, password: String!): AuthData!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  input UserInputData {
    name: String
    email: String
    password: String
  }

  type AuthData {
    userId: ID!
    token: String!
  }
`;

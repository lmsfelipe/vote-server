const { gql } = require("apollo-server-express");

module.exports = gql`
  type Vote {
    _id: ID!
    userId: String!
    shirtId: String!
    createdAt: String!
    updatedAt: String!
  }
`;

const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    setVote(userId: String!, shirtId: String!): Vote!
  }

  extend type Subscription {
    shirtVoted: Shirt
  }

  type Vote {
    _id: ID!
    userId: String!
    shirtId: String!
    createdAt: String!
    updatedAt: String!
  }
`;

const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    setVote(shirtId: String!): Vote!
  }

  extend type Subscription {
    shirtVoted: Shirt
  }

  type Vote implements Node {
    _id: ID!
    userId: String!
    shirtId: String!
    votes: Int!
    createdAt: String!
    updatedAt: String!
  }
`;

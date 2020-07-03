const { gql } = require('apollo-server-express');

const Shirt = require('./shirt');
const User = require('./user');
const Team = require('./team');
const Vote = require('./vote');

const RootSchema = gql`
  type Mutation {
    _empty: String
  }

  type Query {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: ID!
  }
`;

module.exports = [RootSchema, Team, Shirt, User, Vote];

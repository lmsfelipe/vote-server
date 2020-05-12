const { gql } = require('apollo-server-express');

const Shirt = require('./Shirt/schema');
const User = require('./User/schema');
const Team = require('./Team/schema');
const Vote = require('./Vote/schema');

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
`;

module.exports = [RootSchema, Team, Shirt, User, Vote];

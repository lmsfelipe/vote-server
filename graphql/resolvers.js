const { merge } = require('lodash');

const UserResolver = require('./User/resolvers');
const ShirtResolver = require('./Shirt/resolvers');
const TeamResolver = require('./Team/resolvers');
const VoteResolver = require('./Vote/resolvers');

const resolvers = merge(
  UserResolver,
  ShirtResolver,
  TeamResolver,
  VoteResolver,
);

module.exports = resolvers;

const merge = require('lodash/merge');

const userResolver = require('./user');
const shirtResolver = require('./shirt');
const teamResolver = require('./team');
const voteResolver = require('./vote');

const resolvers = merge(
  userResolver,
  shirtResolver,
  teamResolver,
  voteResolver,
);

module.exports = resolvers;

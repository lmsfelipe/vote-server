const { PubSub, ApolloError } = require('apollo-server-express');

const Shirt = require('../../models/shirt');
const Vote = require('../../models/vote');
const { checkAuthentication } = require('../../utils/authChecks');

const pubsub = new PubSub();
const ADDED_SHIRT_VOTE = 'ADDED_SHIRT_VOTE';

module.exports = {
  Subscription: {
    shirtVoted: {
      subscribe: (parent, args, context) => {
        checkAuthentication(context);
        pubsub.asyncIterator([ADDED_SHIRT_VOTE]);
      },
    },
  },

  Mutation: {
    async setVote(parent, { userId, shirtId }, context) {
      checkAuthentication(context);
      const shirt = await Shirt.findById(shirtId);

      if (!shirt) {
        throw new ApolloError('Camisa não encontrada.', 400);
      }

      shirt.votes += 1;
      await shirt.save();
      const populatedData = await Shirt.populate(shirt, { path: 'team' });

      pubsub.publish(ADDED_SHIRT_VOTE, { shirtVoted: populatedData });

      const vote = new Vote({ userId, shirtId });
      const voteData = await vote.save();

      return voteData;
    },
  },
};

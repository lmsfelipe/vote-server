const { PubSub, ApolloError } = require('apollo-server-express');

const { checkAuthentication } = require('../../utils/auth-checks');

const pubsub = new PubSub();
const ADDED_SHIRT_VOTE = 'ADDED_SHIRT_VOTE';

module.exports = {
  Subscription: {
    shirtVoted: {
      subscribe: (_, __, context) => {
        checkAuthentication(context);
        pubsub.asyncIterator([ADDED_SHIRT_VOTE]);
      },
    },
  },

  Mutation: {
    async setVote(_, { shirtId }, context) {
      checkAuthentication(context);

      const { Shirt, Vote } = context.models;
      const shirt = await Shirt.findById(shirtId);

      if (!shirt) {
        throw new ApolloError('Camisa não encontrada.', 400);
      }

      shirt.votes += 1;
      await shirt.save();
      const populatedData = await Shirt.populate(shirt, { path: 'team' });

      pubsub.publish(ADDED_SHIRT_VOTE, { shirtVoted: populatedData });

      const { userId } = context.authScope.userId;
      const vote = new Vote({ userId, shirtId });
      const voteData = await vote.save();

      return voteData;
    },
  },
};

const { PubSub, ApolloError } = require('apollo-server-express');

const { checkAuthentication } = require('../../utils/auth-checks');

const pubsub = new PubSub();
const ADDED_SHIRT_VOTE = 'ADDED_SHIRT_VOTE';

module.exports = {
  Subscription: {
    shirtVoted: {
      subscribe: () => {
        const asyncIterator = pubsub.asyncIterator([ADDED_SHIRT_VOTE]);
        return asyncIterator;
      },
    },
  },

  Mutation: {
    async setVote(_, { shirtId }, context) {
      checkAuthentication(context);

      const { Vote } = context.models;
      const { teamsLoader, shirtsLoader } = context.loaders;
      const shirt = await shirtsLoader.load(shirtId);

      if (!shirt) {
        throw new ApolloError('Camisa não encontrada.', 400);
      }

      shirt.votes += 1;
      const shirtRes = await shirt.save();
      const teamRes = await teamsLoader.load(shirtRes.team);

      const populatedShirt = {
        ...shirtRes._doc,
        team: teamRes,
      };

      pubsub.publish(ADDED_SHIRT_VOTE, { shirtVoted: populatedShirt });
      const { userId } = context.authScope;
      const vote = new Vote({ userId, shirtId, votes: shirtRes.votes });
      const voteData = await vote.save();

      return voteData;
    },
  },
};

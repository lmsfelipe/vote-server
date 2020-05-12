const { PubSub } = require('apollo-server-express');

const Shirt = require('../../models/shirt');
const Vote = require('../../models/vote');

const pubsub = new PubSub();
const ADDED_SHIRT_VOTE = 'ADDED_SHIRT_VOTE';

module.exports = {
  Subscription: {
    shirtVoted: {
      subscribe: () => pubsub.asyncIterator([ADDED_SHIRT_VOTE]),
    },
  },

  Mutation: {
    async setVote(parent, args) {
      const { userId, shirtId } = args;
      const shirt = await Shirt.findById(shirtId);

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

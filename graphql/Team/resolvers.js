const Team = require("../../models/team");

module.exports = {
  Query: {
    teams: async function () {
      const teams = await Team.find();

      return teams;
    },
  },

  Mutation: {
    createTeam: async function (parent, { teamInput }) {
      const { name, slug, image } = teamInput;

      const team = new Team({ name, slug, image });
      const createTeam = await team.save();

      return { ...createTeam._doc };
    },
  },
};

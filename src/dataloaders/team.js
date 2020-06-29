const DataLoader = require('dataloader');

const Team = require('../models/team');
const { groupById } = require('../helpers');

const batchTeams = async (ids) => {
  const teams = await Team.find({ _id: { $in: ids } });
  const teamMap = groupById(teams);

  return ids.map((id) => teamMap[id]);
};

const teamsLoader = () => new DataLoader(batchTeams);

module.exports = teamsLoader;

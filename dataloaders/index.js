const shirtsLoader = require('./shirt');
const teamsLoader = require('./team');

const loaders = {
  teamsLoader: teamsLoader(),
  shirtsLoader: shirtsLoader(),
};

module.exports = loaders;

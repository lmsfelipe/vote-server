const DataLoader = require('dataloader');

const Shirt = require('../models/shirt');
const { groupById } = require('../helpers');

const batchShirts = async (ids) => {
  const shirts = await Shirt.find({ _id: { $in: ids } });
  const shirtMap = groupById(shirts);

  return ids.map((id) => shirtMap[id]);
};

const shirtsLoader = () => new DataLoader(batchShirts);

module.exports = shirtsLoader;

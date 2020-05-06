const Shirt = require("../../models/shirt");

module.exports = {
  Query: {
    shirts: async function () {
      const shirts = await Shirt.find().populate("team");

      return shirts;
    },
  },

  Mutation: {
    createShirt: async function (parent, { shirtInput }) {
      const { name, slug, mainImage, teamId, year, brand, images } = shirtInput;

      const shirt = new Shirt({
        name,
        slug,
        mainImage,
        year,
        team: teamId,
        brand,
        images,
      });
      const createShirt = await shirt.save();

      return { ...createShirt._doc };
    },
  },
};

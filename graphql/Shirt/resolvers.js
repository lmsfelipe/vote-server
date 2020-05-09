const joi = require("@hapi/joi");
const { UserInputError } = require("apollo-server-express");

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

      const schema = joi.object({
        name: joi.string().min(3).max(30).required().messages({
          "string.base": "Nome deve ser um capo de texto.",
          "string.min": `Nome precisa ter no mínimo {#limit} caracteres.`,
          "string.max": `Nome precisa ter no máximo {#limit} caracteres.`,
        }),
        slug: joi.string().messages({
          "string.base": "Slug deve ser um campo de texto.",
        }),
        mainImage: joi.string().uri().messages({
          "string.base": "MainImagem deve ser um campo de texto.",
          "string.uri": "MainImagem deve ser uma uri.",
        }),
        year: joi.number().integer().min(1900).max(2020).messages({
          "number.base": "Ano deve ser um campo numérico.",
        }),
        teamId: joi.string().messages({
          "string.base": "Imagem deve ser um campo de texto.",
        }),
        brand: joi.string().messages({
          "string.base": "Imagem deve ser um campo de texto.",
        }),
        images: joi.array().items({
          url: joi.string().uri(),
          name: joi.string(),
        }),
      });

      const { error } = schema.validate(shirtInput, { abortEarly: false });

      if (error) {
        throw new UserInputError("Houve um erro em um dos campos", {
          validationErrors: error.details,
          code: 422,
        });
      }

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

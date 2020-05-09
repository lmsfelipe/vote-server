const joi = require("@hapi/joi");
const { UserInputError } = require("apollo-server-express");

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
      const schema = joi.object({
        name: joi.string().min(3).max(30).required().messages({
          "string.base": "Nome deve ser um capo de texto.",
          "string.min": `Nome precisa ter no mínimo {#limit} caracteres.`,
          "string.max": `Nome precisa ter no máximo {#limit} caracteres.`,
        }),
        slug: joi.string().messages({
          "string.base": "Slug deve ser um campo de texto.",
        }),
        image: joi.string().uri().messages({
          "string.base": "Imagem deve ser um campo de texto.",
          "string.uri": "Imagem deve ser uma uri.",
        }),
      });

      const { error } = schema.validate(teamInput, { abortEarly: false });

      if (error) {
        throw new UserInputError("Houve um erro em um dos campos", {
          validationErrors: error.details,
          code: 422,
        });
      }

      const team = new Team(teamInput);
      const createTeam = await team.save();

      return { ...createTeam._doc };
    },
  },
};

const joi = require("@hapi/joi");
const { UserInputError, ApolloError } = require("apollo-server-express");

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
        slug: joi.string().required().messages({
          "string.base": "Slug deve ser um campo de texto.",
        }),
        image: joi.string().uri().required().messages({
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
      let createTeam = {};
      try {
        createTeam = await team.save();
      } catch (error) {
        throw new ApolloError("Não foi possível criar o time.", 400);
      }

      return createTeam;
    },

    editTeam: async function (parent, { id, teamInput }) {
      let team = {};

      const schema = joi.object({
        name: joi.string().min(3).max(30),
        slug: joi.string(),
        image: joi.string().uri(),
      });

      const { error } = schema.validate(teamInput, { abortEarly: false });

      if (error) {
        throw new UserInputError("Houve um erro em um dos campos", {
          validationErrors: error.details,
          code: 422,
        });
      }

      try {
        team = await Team.findByIdAndUpdate(id, teamInput, {
          new: true,
        });
      } catch (error) {
        throw new ApolloError("Não foi possível editar o time.", 400);
      }

      return team;
    },

    deleteTeam: async function (parent, { id }) {
      const deletedTeam = await Team.findByIdAndDelete(id);

      if (deletedTeam) {
        return deletedTeam;
      }

      throw new ApolloError("Não foi possível remover o time.", 400);
    },
  },
};

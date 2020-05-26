const joi = require('@hapi/joi');
const { UserInputError, ApolloError } = require('apollo-server-express');

const {
  checkAuthentication,
  checkAuthorization,
} = require('../../utils/auth-checks');

module.exports = {
  Query: {
    async teams(_, __, { models }) {
      const teams = await models.Team.find();

      return teams;
    },
  },

  Mutation: {
    async createTeam(_, { teamInput }, context) {
      checkAuthentication(context);
      checkAuthorization(context);

      const schema = joi.object({
        name: joi.string().min(3).max(30).required().messages({
          'string.base': 'Nome deve ser um capo de texto.',
          'string.min': 'Nome precisa ter no mínimo {#limit} caracteres.',
          'string.max': 'Nome precisa ter no máximo {#limit} caracteres.',
        }),
        slug: joi.string().required().messages({
          'string.base': 'Slug deve ser um campo de texto.',
        }),
        image: joi.string().uri().required().messages({
          'string.base': 'Imagem deve ser um campo de texto.',
          'string.uri': 'Imagem deve ser uma uri.',
        }),
      });

      const { error } = schema.validate(teamInput, { abortEarly: false });

      if (error) {
        throw new UserInputError('Houve um erro em um dos campos', {
          validationErrors: error.details,
          code: 422,
        });
      }

      const { Team } = context.models;
      const team = new Team(teamInput);
      let createTeam = {};

      try {
        createTeam = await team.save();
      } catch (err) {
        throw new ApolloError('Não foi possível criar o time.', 400);
      }

      return createTeam;
    },

    async editTeam(parent, { id, teamInput }, context) {
      checkAuthentication(context);
      checkAuthorization(context);

      const schema = joi.object({
        name: joi.string().min(3).max(30),
        slug: joi.string(),
        image: joi.string().uri(),
      });

      const { error } = schema.validate(teamInput, { abortEarly: false });

      if (error) {
        throw new UserInputError('Houve um erro em um dos campos', {
          validationErrors: error.details,
          code: 422,
        });
      }

      const { Team } = context.models;
      const reqError = new ApolloError('Não foi possível editar o time.', 400);
      let editedTeam = {};

      try {
        editedTeam = await Team.findByIdAndUpdate(id, teamInput, {
          new: true,
          useFindAndModify: false,
        });
      } catch (err) {
        throw reqError;
      }

      if (!editedTeam) {
        throw reqError;
      }

      return editedTeam;
    },

    async deleteTeam(parent, { id }, context) {
      checkAuthentication(context);
      checkAuthorization(context);

      const { Team } = context.models;
      const deletedTeam = await Team.findByIdAndDelete(id);

      if (!deletedTeam) {
        throw new ApolloError('Não foi possível remover o time.', 400);
      }

      return deletedTeam;
    },
  },
};

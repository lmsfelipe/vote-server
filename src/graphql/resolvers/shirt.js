const joi = require('@hapi/joi');
const { UserInputError, ApolloError } = require('apollo-server-express');

const paginateResults = require('../../utils/paginate-results');
const {
  checkAuthentication,
  checkAuthorization,
} = require('../../utils/auth-checks');

module.exports = {
  Query: {
    async shirts(_, { first = 5, after }, { models }) {
      const query = after ? { _id: { $gt: after } } : {};
      let resp = [];

      try {
        resp = await models.Shirt.find(query)
          .limit(first + 1) // Increase 1 to check if has more results
          .lean();
      } catch (error) {
        throw new ApolloError(error.response, 400);
      }

      if (!resp) {
        throw new ApolloError('Não foi possível buscar as camisas.', 400);
      }

      const shirts = paginateResults(first, resp);

      return shirts;
    },

    async shirtById(_, { id }, { loaders }) {
      const { shirtsLoader } = loaders;
      if (!id) throw new ApolloError('O campo ID é obrigatório', 400);

      const shirt = await shirtsLoader.load(id);
      if (!shirt) throw new ApolloError('Nenhuma camisa foi encontrada', 404);

      return shirt;
    },
  },

  Shirt: {
    async team(shirt, _, { loaders }) {
      const { teamsLoader } = loaders;
      const id = shirt.team._id;
      if (!id) throw new ApolloError('O campo ID é obrigatório', 400);

      const teamId = id.toString();
      const team = await teamsLoader.load(teamId);
      if (!team) throw new ApolloError('Nenhum time foi encontrado', 404);

      return team;
    },
  },

  Node: {
    __resolveType(node) {
      return node.type;
    },
  },

  Mutation: {
    async createShirt(_, { shirtInput }, context) {
      const { name, slug, mainImage, teamId, year, brand, images } = shirtInput;
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
        mainImage: joi.string().uri().required().messages({
          'string.base': 'MainImagem deve ser um campo de texto.',
          'string.uri': 'MainImagem deve ser uma uri.',
        }),
        year: joi.number().integer().min(1900).max(2020).required().messages({
          'number.base': 'Ano deve ser um campo numérico.',
        }),
        teamId: joi.string().required().messages({
          'string.base': 'Imagem deve ser um campo de texto.',
        }),
        brand: joi.string().required().messages({
          'string.base': 'Imagem deve ser um campo de texto.',
        }),
        images: joi.array().required().items({
          url: joi.string().uri(),
          name: joi.string(),
        }),
      });

      const { error } = schema.validate(shirtInput, { abortEarly: false });

      if (error) {
        throw new UserInputError('Houve um erro em um dos campos', {
          validationErrors: error.details,
          code: 422,
        });
      }

      const { Shirt } = context.models;
      const shirt = new Shirt({
        name,
        slug,
        mainImage,
        year,
        team: teamId,
        brand,
        images,
      });

      let createShirt = {};
      try {
        createShirt = await shirt.save();
      } catch (err) {
        throw new ApolloError('Não foi possível criar a camisa.', 400);
      }

      return createShirt;
    },

    async editShirt(_, { id, shirtInput }, context) {
      checkAuthentication(context);
      checkAuthorization(context);

      if (!id) {
        throw new ApolloError('Id é obrigatório.', 400);
      }

      const schema = joi.object({
        name: joi.string().min(3).max(30),
        slug: joi.string(),
        mainImage: joi.string().uri(),
        year: joi.number().integer().min(1900).max(2020),
        teamId: joi.string(),
        brand: joi.string(),
        images: joi.array().items({
          url: joi.string().uri(),
          name: joi.string(),
        }),
      });

      const { error } = schema.validate(shirtInput, { abortEarly: false });

      if (error) {
        throw new UserInputError('Houve um erro em um dos campos', {
          validationErrors: error.details,
          code: 422,
        });
      }

      const payload = {
        ...shirtInput,
        ...(shirtInput.teamId && { team: shirtInput.teamId }),
      };

      const { Shirt } = context.models;
      let editedShirt = {};
      const reqError = new ApolloError(
        'Não foi possível editar a camisa.',
        400,
      );

      try {
        editedShirt = await Shirt.findByIdAndUpdate(id, payload, {
          new: true,
          useFindAndModify: false,
        });
      } catch (err) {
        throw reqError;
      }

      if (!editedShirt) {
        throw reqError;
      }

      return editedShirt;
    },

    async deleteShirt(_, { id }, context) {
      checkAuthentication(context);
      checkAuthorization(context);

      if (!id) {
        throw new ApolloError('Id é obrigatório.', 400);
      }

      const { Shirt } = context.models;
      const deletedShirt = await Shirt.findByIdAndDelete(id);

      if (deletedShirt) {
        return deletedShirt;
      }

      throw new ApolloError('Não foi possível remover a camisa.', 400);
    },
  },
};

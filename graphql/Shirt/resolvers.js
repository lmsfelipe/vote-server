const joi = require('@hapi/joi');
const { UserInputError, ApolloError } = require('apollo-server-express');

const {
  checkAuthentication,
  checkAuthorization,
} = require('../../utils/auth-checks');

module.exports = {
  Query: {
    async shirts(_, __, { models }) {
      const shirts = await models.Shirt.find();

      return shirts;
    },

    async shirtById(_, { id }, { loaders }) {
      const { shirtsLoader } = loaders;
      const shirt = await shirtsLoader.load(id);

      return shirt;
    },
  },

  Shirt: {
    async team(shirt, _, { loaders }) {
      const { teamsLoader } = loaders;
      const shirtId = shirt.team._id.toString();
      const team = await teamsLoader.load(shirtId);

      return team;
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
        throw new ApolloError('Não foi criar a camisa.', 400);
      }

      return createShirt;
    },

    async editShirt(_, { id, shirtInput }, context) {
      checkAuthentication(context);
      checkAuthorization(context);

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

      const { Shirt } = context.models;
      const payload = { ...shirtInput, team: shirtInput.teamId };
      let editedShirt = {};

      try {
        editedShirt = await Shirt.findByIdAndUpdate(id, payload, {
          new: true,
          useFindAndModify: false,
        });
      } catch (err) {
        throw new ApolloError('Não foi possível editar a camisa.', 400);
      }

      return editedShirt;
    },

    async deleteShirt(_, { id }, context) {
      checkAuthentication(context);
      checkAuthorization(context);

      const { Shirt } = context.models;
      const deletedShirt = await Shirt.findByIdAndDelete(id);

      if (deletedShirt) {
        return deletedShirt;
      }

      throw new ApolloError('Não foi possível remover a camisa.', 400);
    },
  },
};

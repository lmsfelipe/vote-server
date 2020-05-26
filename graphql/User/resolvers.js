const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('@hapi/joi');
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require('apollo-server-express');

const { checkAuthentication } = require('../../utils/auth-checks');

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  Query: {
    async login(_, { email, password }, { models }) {
      const schema = joi.object({
        email: joi.string().email().messages({
          'string.email': 'Formato de e-mail inválido.',
        }),
        password: joi.string().messages({
          'string.base': 'Senha deve ser em campo de texto.',
        }),
      });

      const { error } = schema.validate(
        { email, password },
        { abortEarly: false },
      );

      if (error) {
        throw new UserInputError('Houve um erro em um dos campos.', {
          validationErrors: error.details,
          code: 422,
        });
      }

      const user = await models.User.findOne({ email });
      const authError = () => {
        const authErr = new AuthenticationError('Usuário não encontrado.');
        authErr.code = 401;
        throw authErr;
      };
      if (!user) {
        authError();
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        authError();
      }

      const userId = user._id.toString();
      const { role } = user;
      const token = jwt.sign(
        {
          userId,
          role,
        },
        jwtSecret,
        { expiresIn: '1h' },
      );

      return {
        token,
        userId,
      };
    },
  },

  Mutation: {
    async createUser(parent, { userInput }, { models }) {
      const { name, email, password } = userInput;

      const schema = joi.object({
        name: joi.string().min(3).max(30).required().messages({
          'string.base': 'Nome deve ser um capo de texto.',
          'string.min': 'Nome precisa ter no mínimo {#limit} caracteres.',
          'string.max': 'Nome precisa ter no máximo {#limit} caracteres.',
        }),
        email: joi.string().email().required().messages({
          'string.base': 'Email deve ser um campo de texto.',
          'string.email': 'Formato de e-mail inválido.',
        }),
        password: joi
          .string()
          .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
          .required()
          .messages({
            'string.pattern.base': 'Formato de senha inválido.',
          }),
      });

      const { error } = schema.validate(userInput, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          'Por favor, verifique os campos preenchidos.',
          {
            validationErrors: error.details,
            code: 422,
          },
        );
      }

      const { User } = models;
      const hasEmail = await User.findOne({ email });
      if (hasEmail) {
        throw new UserInputError('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({ email, name, password: hashedPassword });
      let createUser = {};
      try {
        createUser = await user.save();
      } catch (err) {
        throw new ApolloError('Não foi possível criar o usuário.', 400);
      }

      return createUser;
    },

    async editUser(parent, { id, userInput }, context) {
      checkAuthentication(context);
      let user = {};

      const schema = joi.object({
        name: joi.string().min(3).max(30),
        email: joi.string().email(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      });

      const { error } = schema.validate(userInput, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          'Por favor, verifique os campos preenchidos.',
          {
            validationErrors: error.details,
            code: 422,
          },
        );
      }

      const { User } = context.models;
      try {
        user = await User.findByIdAndUpdate(id, userInput, {
          new: true,
        });
      } catch (err) {
        throw new ApolloError('Não foi possível editar o usuário.', 400);
      }

      return user;
    },
  },
};

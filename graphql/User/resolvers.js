const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("@hapi/joi");
const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");

const User = require("../../models/user");

module.exports = {
  Query: {
    login: async function (parent, { email, password }) {
      const schema = joi.object({
        email: joi.string().email().messages({
          "string.email": "Formato de e-mail inválido.",
        }),
        password: joi.string().messages({
          "string.base": "Senha deve ser em campo de texto.",
        }),
      });

      const { error } = schema.validate(
        { email, password },
        { abortEarly: false }
      );

      if (error) {
        throw new UserInputError("Houve um erro em um dos campos.", {
          validationErrors: error.details,
          code: 422,
        });
      }

      const user = await User.findOne({ email });
      const authError = () => {
        const error = new AuthenticationError("Usuário não encontrado.");
        error.code = 401;
        throw error;
      };
      if (!user) {
        authError();
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        authError();
      }

      const userId = user._id.toString();
      const token = jwt.sign(
        {
          userId,
          email,
        },
        "mysupersecret",
        { expiresIn: "1h" }
      );

      return {
        token,
        userId,
      };
    },
  },

  Mutation: {
    createUser: async function (parent, { userInput }) {
      const { name, email, password } = userInput;

      const schema = joi.object({
        name: joi.string().min(3).max(30).required().messages({
          "string.base": "Nome deve ser um capo de texto.",
          "string.min": `Nome precisa ter no mínimo {#limit} caracteres.`,
          "string.max": `Nome precisa ter no máximo {#limit} caracteres.`,
        }),
        email: joi.string().email().messages({
          "string.base": "Email deve ser um campo de texto.",
          "string.email": "Formato de e-mail inválido.",
        }),
        password: joi
          .string()
          .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
          .messages({
            "string.pattern.base": "Formato de senha inválido.",
          }),
      });

      const { error } = schema.validate(userInput, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Por favor, verifique os campos preenchidos.",
          {
            validationErrors: error.details,
          }
        );
      }

      const hasEmail = await User.findOne({ email });
      if (hasEmail) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({ email, name, password: hashedPassword });
      const createUser = await user.save();

      return { ...createUser._doc };
    },
  },
};

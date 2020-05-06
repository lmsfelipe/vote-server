const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  Query: {
    login: async function ({ email, password }) {
      const user = await User.findOne({ email });
      const userId = user._id.toString();

      if (!user) {
        throw new Error("User not found");
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        throw new Error("Wrong password");
      }

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

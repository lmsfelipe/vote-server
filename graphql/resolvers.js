const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Team = require("../models/team");
const Shirt = require("../models/shirt");
const User = require("../models/user");
const Vote = require("../models/vote");

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

    teams: async function () {
      const teams = await Team.find();

      return teams;
    },
  },

  Mutation: {
    createTeam: async function ({ teamInput }) {
      const { name, slug, image } = teamInput;

      const team = new Team({ name, slug, image });
      const createTeam = await team.save();

      return { ...createTeam._doc };
    },

    createShirt: async function ({ shirtInput }) {
      const { name, slug, mainImage, teamId, year, brand, images } = shirtInput;

      const team = await Team.findById(teamId);

      const shirt = new Shirt({
        name,
        slug,
        mainImage,
        year,
        team,
        brand,
        images,
      });
      const createShirt = await shirt.save();

      return { ...createShirt._doc };
    },

    createUser: async function ({ userInput }) {
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

    setVote: async function (parent, args) {
      const { userId, shirtId } = args;
      const shirt = await Shirt.findById(shirtId);

      shirt.votes += 1;
      await shirt.save();

      const vote = new Vote({ userId, shirtId });
      const voteData = await vote.save();

      return { ...voteData._doc };
    },
  },
};

const { gql } = require("apollo-server-express");

const ShirtSchema = require("./Shirt/schema");
const User = require("./User/schema");
const Team = require("./Team/schema");
const Vote = require("./Vote/schema");

const Schema = gql`
  type Mutation {
    createTeam(teamInput: TeamInputData): Team!
    createShirt(shirtInput: ShirtInputData): Shirt!
    createUser(userInput: UserInputData): User!
    setVote(userId: String!, shirtId: String!): Vote!
  }

  type Query {
    teams: [Team!]!
    shirts: [Shirt!]!
    login(email: String!, password: String!): AuthData!
  }

  type Subscription {
    shirtVoted: Shirt
  }
`;

module.exports = [Schema, Team, ShirtSchema, User, Vote];

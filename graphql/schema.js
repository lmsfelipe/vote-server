const { gql } = require("apollo-server-express");

const team = require("./team");
const shirt = require("./shirt");
const user = require("./user");
const vote = require("./vote");

const schema = gql`
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
    addedShirtVote: Shirt
  }
`;

module.exports = [schema, team, shirt, user, vote];

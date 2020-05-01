const { gql } = require("apollo-server-express");

module.exports = gql`
  type Team {
    _id: ID!
    name: String!
    slug: String!
    image: String!
    createdAt: String!
    updatedAt: String!
  }

  type Shirt {
    _id: ID!
    name: String!
    slug: String!
    mainImage: String!
    year: Int!
    votes: Int
    team: Team!
    brand: String!
    titles: [String]
    images: [ShirtImages!]
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Vote {
    _id: ID!
    userId: String!
    shirtId: String!
    createdAt: String!
    updatedAt: String!
  }

  type ShirtImages {
    url: String!
    name: String!
  }

  input ShirtImagesInput {
    url: String!
    name: String!
  }

  input UserInputData {
    name: String!
    email: String!
    password: String!
  }

  input TeamInputData {
    name: String!
    slug: String!
    image: String!
  }

  input ShirtInputData {
    name: String!
    slug: String!
    mainImage: String!
    year: Int!
    brand: String!
    images: [ShirtImagesInput!]!
    teamId: ID!
  }

  type AuthData {
    userId: ID!
    token: String!
  }

  type TeamData {
    teams: [Team!]!
  }

  type Mutation {
    createTeam(teamInput: TeamInputData): Team!
    createShirt(shirtInput: ShirtInputData): Shirt!
    createUser(userInput: UserInputData): User!
    setVote(userId: String!, shirtId: String!): Vote!
  }

  type Query {
    teams: [Team!]!
    login(email: String!, password: String!): AuthData!
  }
`;

const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Mutation {
    createShirt(shirtInput: ShirtInputData): Shirt!
    editShirt(id: ID!, shirtInput: ShirtInputData): Shirt!
    deleteShirt(id: ID!): Shirt!
  }

  extend type Query {
    shirts: [Shirt!]!
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

  type ShirtImages {
    url: String!
    name: String!
  }

  input ShirtImagesInput {
    url: String!
    name: String!
  }

  input ShirtInputData {
    name: String
    slug: String
    mainImage: String
    year: Int
    brand: String
    images: [ShirtImagesInput]
    teamId: ID
  }
`;

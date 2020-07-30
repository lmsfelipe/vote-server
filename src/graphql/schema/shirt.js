const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    createShirt(shirtInput: ShirtInputData): Shirt!
    editShirt(id: ID!, shirtInput: ShirtInputData): Shirt!
    deleteShirt(id: ID!): Shirt!
  }

  extend type Query {
    shirts(first: Int, after: ID): ShirtConnection!
    shirtById(id: ID!): Shirt!
  }

  type ShirtConnection {
    edges: [ShirtsEdge]!
    pageInfo: PageInfo!
  }

  type ShirtsEdge {
    cursor: ID!
    node: Shirt!
  }

  type Shirt implements Node {
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

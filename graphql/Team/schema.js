const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    createTeam(teamInput: TeamInputData): Team!
    editTeam(id: ID!, teamInput: TeamInputData): Team!
    deleteTeam(id: ID!): Team!
  }

  extend type Query {
    teams: [Team!]!
  }

  type Team {
    _id: ID!
    name: String!
    slug: String!
    image: String!
    region: ShirtRegion!
    createdAt: String!
    updatedAt: String!
  }

  type ShirtRegion {
    country: String!
    state: String!
    city: String!
  }

  input TeamInputData {
    name: String
    slug: String
    image: String
  }
`;

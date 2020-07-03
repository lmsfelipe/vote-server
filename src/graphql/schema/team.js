const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Mutation {
    createTeam(teamInput: TeamInputData): Team!
    editTeam(id: ID!, teamInput: TeamInputData): Team!
    deleteTeam(id: ID!): Team!
  }

  extend type Query {
    teams(first: Int, after: ID): TeamConnection!
    teamById(id: ID!): Team!
  }

  type TeamConnection {
    edges: [TeamsEdge]!
    pageInfo: PageInfo!
  }

  type TeamsEdge {
    cursor: ID!
    node: Team!
  }

  type Team {
    _id: ID!
    name: String!
    slug: String!
    image: String!
    region: TeamRegion!
    createdAt: String!
    updatedAt: String!
  }

  type TeamRegion {
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

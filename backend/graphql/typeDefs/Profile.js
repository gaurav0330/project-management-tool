const { gql } = require('apollo-server-express');

const profileTypeDefs = gql`
  type Skill {
    name: String!
    proficiency: String!
  }

  type Profile {
    id: ID!
    user: User!
    skills: [Skill!]!
    availability: String!
    workload: Int!
    GithubUsername: String!
    createdAt: String!
  }

  extend type Query {
    getProfile(userId: ID!): Profile
  }

  extend type Mutation {
    createProfile(userId: ID!, skills: [SkillInput!]!, GithubUsername: String!): Profile
    updateProfile(
      userId: ID!
      availability: String
      workload: Int
      skills: [SkillInput!]
      GithubUsername: String
    ): Profile
  }

  input SkillInput {
    name: String!
    proficiency: String!
  }
`;

module.exports = profileTypeDefs;
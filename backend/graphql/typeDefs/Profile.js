const { gql } = require("apollo-server-express");

const profileTypeDefs = gql`
  enum Proficiency {
    beginner
    intermediate
    advanced
  }

  enum Availability {
    available
    busy
    offline
  }

  type Skill {
    name: String!
    proficiency: Proficiency!
  }

  input SkillInput {
    name: String!
    proficiency: Proficiency!
  }

  type Profile {
    id: ID!
    user: User!
    skills: [Skill!]!
    availability: Availability!
    workload: Int!
    GithubUsername: String!
    createdAt: String!
  }

  extend type Query {
    getProfile(userId: ID!): Profile
  }

  extend type Mutation {
    createProfile(
      userId: ID!
      skills: [SkillInput!]!
      GithubUsername: String!
    ): Profile

    updateProfile(
      userId: ID!
      availability: Availability
      workload: Int
      skills: [SkillInput!]
      GithubUsername: String
    ): Profile
  }
`;

module.exports = profileTypeDefs;

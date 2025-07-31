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

  enum PreferredRole {
    frontend
    backend
    fullstack
    mobile
    devops
    ui_ux
    testing
    database
  }

  enum ExperienceLevel {
    junior
    mid
    senior
    lead
  }

  enum ProjectRole {
    lead
    developer
    designer
    tester
  }

  type Skill {
    name: String!
    proficiency: Proficiency!
    experienceYears: Int!
    lastUsed: String!
    certifications: [String!]!
  }

  type ProjectExperience {
    projectType: String!
    domain: String!
    role: ProjectRole!
    duration: Int!
    technologies: [String!]!
    completedAt: String!
  }

  type Experience {
    totalYears: Int!
    currentLevel: ExperienceLevel!
    projectsCompleted: Int!
    projectExperience: [ProjectExperience!]!
  }

  type Preferences {
    projectTypes: [String!]!
    domains: [String!]!
  }

  type Performance {
    completionRate: Float!
    averageRating: Float!
    totalRatings: Int!
    collaborationScore: Float!
  }

  type Profile {
    id: ID!
    user: User!
    GithubUsername: String!
    skills: [Skill!]!
    availability: Availability!
    workload: Int!
    preferredRoles: [PreferredRole!]!
    experience: Experience!
    preferences: Preferences!
    performance: Performance!
    learningGoals: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  # Input types
  input SkillInput {
    name: String!
    proficiency: Proficiency!
    experienceYears: Int
    certifications: [String!]
  }

  input ProjectExperienceInput {
    projectType: String!
    domain: String!
    role: ProjectRole!
    duration: Int!
    technologies: [String!]!
  }

  input PreferencesInput {
    projectTypes: [String!]
    domains: [String!]
  }

  extend type Query {
    getProfile(userId: ID!): Profile
    getAllProfiles: [Profile!]!
  }

  extend type Mutation {
    createProfile(
      userId: ID!
      skills: [SkillInput!]!
      GithubUsername: String!
      availability: Availability
      workload: Int
      preferredRoles: [PreferredRole!]
    ): Profile

    updateProfile(
      userId: ID!
      availability: Availability
      workload: Int
      skills: [SkillInput!]
      GithubUsername: String
      preferredRoles: [PreferredRole!]
      preferences: PreferencesInput
      learningGoals: [String!]
    ): Profile

    addProjectExperience(
      userId: ID!
      projectExperience: ProjectExperienceInput!
    ): Profile

    updateExperience(
      userId: ID!
      totalYears: Int
      currentLevel: ExperienceLevel
      projectsCompleted: Int
    ): Profile
  }
`;

module.exports = profileTypeDefs;

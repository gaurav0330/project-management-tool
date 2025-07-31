const { gql } = require("apollo-server-express");

const typeDefs = gql`
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

  enum UserRole {
    Project_Manager
    Team_Lead
    Team_Member
  }

  type Skill {
    name: String!
    proficiency: Proficiency!
    experienceYears: Int!
    lastUsed: String
    certifications: [String!]
  }

  type ProjectExperience {
    projectType: String!
    domain: String!
    role: ProjectRole!
    duration: Int!
    technologies: [String!]
    completedAt: String
  }

  type Experience {
    totalYears: Int!
    currentLevel: ExperienceLevel!
    projectsCompleted: Int!
    projectExperience: [ProjectExperience!]!
  }

  type Performance {
    completionRate: Float!
    averageRating: Float!
    totalRatings: Int!
    collaborationScore: Float!
  }

  type Preferences {
    projectTypes: [String!]!
    domains: [String!]!
  }

  type Profile {
    GithubUsername: String
    availability: Availability
    workload: Int
    preferredRoles: [PreferredRole]
    experience: Experience
    performance: Performance
    skills: [Skill]
    learningGoals: [String]
  }

  type User {
    _id: ID!
    username: String!
    email: String
    role: UserRole!
    profile: Profile
  }

  input BestUserInput {
    projectId: ID!
    title: String!
    userId: ID!
    priority: String!
    dueDate: String
    teamId: ID
  }

  type Query {
    suggestBestUserForTask(input: BestUserInput!): User
  }
`;

module.exports = typeDefs;

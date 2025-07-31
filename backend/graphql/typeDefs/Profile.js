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

  # ✅ FIXED: Made all potentially null fields nullable
  type Performance {
    completionRate: Float!
    averageRating: Float!
    totalRatings: Int!
    collaborationScore: Float!
    onTimeDeliveryRate: Float # ✅ Made nullable
    tasksCompletedThisMonth: Int # ✅ Made nullable - this was causing your error
    averageTaskDuration: Float # ✅ Made nullable
    qualityScore: Float # ✅ Made nullable
    productivityScore: Float # ✅ Made nullable
    recentPerformanceTrend: String # ✅ Made nullable
  }

  type WorkloadDetails {
    totalTasks: Int!
    activeTasks: Int!
    completedTasks: Int!
    overdueTasks: Int!
    highPriorityTasks: Int!
    workloadPercentage: Float!
    tasksByStatus: [TaskStatusCount!]!
  }

  type TaskStatusCount {
    status: String!
    count: Int!
  }

  # ✅ FIXED: Made arrays nullable to prevent empty array issues
  type PerformanceMetrics {
    weeklyCompletion: [WeeklyStats!]
    monthlyTrends: [MonthlyTrend!]
    taskTypePerformance: [TaskTypeStats!]
    collaborationMetrics: CollaborationMetrics!
  }

  type WeeklyStats {
    week: String!
    completed: Int!
    assigned: Int!
    completionRate: Float!
  }

  type MonthlyTrend {
    month: String!
    tasksCompleted: Int!
    averageRating: Float!
    onTimeRate: Float!
  }

  type TaskTypeStats {
    taskType: String!
    completed: Int!
    averageTime: Float!
    successRate: Float!
  }

  type CollaborationMetrics {
    teamProjects: Int!
    crossFunctionalWork: Int!
    mentorshipTasks: Int!
    peerRatings: Float!
  }

  type Profile {
    id: ID!
    user: User!
    GithubUsername: String!
    skills: [Skill!]!
    availability: Availability!
    workload: Int!
    workloadDetails: WorkloadDetails
    preferredRoles: [PreferredRole!]!
    experience: Experience!
    preferences: Preferences!
    performance: Performance!
    performanceMetrics: PerformanceMetrics
    learningGoals: [String!]!
    createdAt: String!
    updatedAt: String!
  }

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
    getUserWorkload(userId: ID!): WorkloadDetails
    getUserPerformanceMetrics(userId: ID!): PerformanceMetrics
  }

  extend type Mutation {
    createProfile(
      userId: ID!
      skills: [SkillInput!]!
      GithubUsername: String!
      availability: Availability
      preferredRoles: [PreferredRole!]
    ): Profile

    updateProfile(
      userId: ID!
      availability: Availability
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

    refreshUserWorkload(userId: ID!): Profile
    refreshUserPerformance(userId: ID!): Profile
  }
`;

module.exports = profileTypeDefs;

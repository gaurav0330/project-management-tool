const { gql } = require('apollo-server-express'); // Assuming Apollo Server; adjust if using another GraphQL lib

const AiSuggtypeDefs = gql`
  # Input for suggesting assignees
  input SuggestAssigneesInput {
    projectId: ID!  # Required to scope to the project
    title: String!
    description: String
    dueDate: String  # ISO date string
    priority: String  # Low, Medium, High
  }

  # A suggested user with score and details
  type SuggestedUser {
    userId: ID!
    username: String!
    role: String!
    score: Float!  # e.g., 0-100 based on match
    reasons: [String!]!  # Why this user was suggested (e.g., "High skill match", "Low workload")
    profile: Profile  # Full profile ref (from your existing Profile type)
  }

  # Response type for suggestions
  type AssigneeSuggestions {
    bestUser: SuggestedUser  # The top/best suggestion (for auto-assign)
    rankedList: [SuggestedUser!]!  # Ranked list (top 3-5) for manual pick
  }

  extend type Query {
    # Query to get suggestions for assignees (leads for managers, members for leads)
    suggestAssignees(input: SuggestAssigneesInput!): AssigneeSuggestions!
  }
`;

module.exports = AiSuggtypeDefs; // Export or merge with your existing schema

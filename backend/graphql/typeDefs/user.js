const { gql } = require("apollo-server-express");

const userTypeDefs = gql`
    enum UserRole {
        Project_Manager
        Team_Lead
        Team_Member
    }

    type User {
        id: ID!
        username: String!
        email: String!
        role: UserRole!
        token: String!
    }

    type Query {
        getUser(userId: ID!): User
        getAllManagers: [User]  # ✅ Query to fetch all managers
        getAllLeads: [User]  # ✅ Query to fetch all leads
        getAllTeamMembers: [User]  # ✅ Query to fetch all leads
        getUsersByProjectId(projectId: ID!): [User!]! # ✅ New query to fetch all users by project ID
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!, role: UserRole!): User
        login(email: String!, password: String!): User
    }
`;

module.exports = userTypeDefs;

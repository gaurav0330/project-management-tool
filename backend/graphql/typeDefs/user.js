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
        token: String
    }

    type Query {
        me: User
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!, role: UserRole!): User
        login(email: String!, password: String!): User
    }
`;

module.exports = userTypeDefs;


const meetingTypes = `
  type Meeting {
    id: ID!
    meetingId: String!
    groupId: String!
    createdBy: String!
    participants: [String!]!
    status: String!
    createdAt: String!
    endedAt: String
    duration: Int
  }

  extend type Query {
    getMeetingHistory(groupId: String!): [Meeting!]!
    getActiveMeeting(groupId: String!): Meeting
  }

  extend type Mutation {
    createMeeting(groupId: String!, meetingId: String!): Meeting!
    endMeeting(meetingId: String!): Meeting!
  }
`;

// Combine with your existing typeDefs
module.exports = meetingTypes;

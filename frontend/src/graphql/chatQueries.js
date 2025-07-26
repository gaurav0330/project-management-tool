import { gql } from "@apollo/client";

// Get all groups for a user in a specific project
export const GET_GROUPS = gql`
  query GetGroups($projectId: ID!) {
    getGroups(projectId: $projectId) {
      id
      name
      type
      project
      team
      members {
        id
        username
        email
        role
      }
    }
  }
`;

// Get groups by lead ID in a specific project
export const GET_GROUPS_BY_LEAD = gql`
  query GetGroupsForLead($leadId: ID!, $projectId: ID!) {
    getGroupsForLead(leadId: $leadId, projectId: $projectId) {
      id
      name
      type
      project
      team
      members {
        id
        name
        email
      }
      teamLead {
        id
        name
        email
      }
    }
  }
`;

//
export const GET_GROUPS_FOR_LEAD = gql`
  query GetGroupsForLead($leadId: ID!, $projectId: ID!) {
    getGroupsForLead(leadId: $leadId, projectId: $projectId) {
      id
        name
        type
        project
        team
        members {
            id
            username
            email
            role
        }
    }
  }
`;

// Get groups by member ID in a specific project
export const GET_GROUPS_BY_MEMBER = gql`
  query GetGroupsByMemberId($memberId: ID!, $projectId: ID!) {
    getGroupsByMemberId(memberId: $memberId, projectId: $projectId) {
      id
      name
      type
      project
      team
      members {
        id
        username
        email
        role
      }
    }
  }
`;

// Create a new group
export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $teamLeadId: ID!, $memberIds: [ID!]!) {
    createGroup(name: $name, teamLeadId: $teamLeadId, memberIds: $memberIds) {
      id
      name
      teamLead {
        id
        username
        email
        role
      }
      members {
        id
        username
        email
        role
      }
    }
  }
`;

// Get messages for a specific group
export const GET_MESSAGES = gql`
  query GetMessages($groupId: ID!) {
    getMessages(groupId: $groupId) {
      id
      content
      createdAt
      sender {
        id
        username
        email
        role
      }
    }
  }
`;

// Send a new message
export const SEND_MESSAGE = gql`
  mutation SendMessage($groupId: ID!, $senderId: ID!, $content: String!) {
    sendMessage(groupId: $groupId, senderId: $senderId, content: $content) {
      id
      content
      createdAt
      sender {
        id
        username
        email
        role
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      role
    }
  }
`; 

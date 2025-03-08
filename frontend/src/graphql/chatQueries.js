import { gql } from "@apollo/client";

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

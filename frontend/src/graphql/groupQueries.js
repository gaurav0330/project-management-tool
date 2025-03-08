import { gql } from "@apollo/client";

// Fetch groups created by the Team Lead
const GET_GROUPS_BY_LEAD_ID = gql`
  query GetGroupsByLeadId($leadId: ID!) {
    getGroupsByLeadId(leadId: $leadId) {
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

 const GET_GROUPS_BY_MEMBER_ID = gql`
  query GetGroupsByMemberId($memberId: ID!) {
    getGroupsByMemberId(memberId: $memberId) {
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
// Create a new group
 const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $memberIds: [ID!]!) {
    createGroup(name: $name, memberIds: $memberIds) {
      id
      name
      members {
        id
        name
      }
    }
  }
`;

export default { GET_GROUPS_BY_LEAD_ID, CREATE_GROUP, GET_GROUPS_BY_MEMBER_ID };
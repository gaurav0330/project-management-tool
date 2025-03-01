import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = gql`
  mutation Mutation(
    $title: String!
    $startDate: String!
    $endDate: String!
    $description: String
  ) {
    createProject(
      title: $title
      startDate: $startDate
      endDate: $endDate
      description: $description
    ) {
      id
      description
      endDate
      startDate
      status
      title
    }
  }
`;

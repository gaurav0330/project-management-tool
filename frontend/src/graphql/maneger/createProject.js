import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = gql`
  mutation Mutation(
    $title: String!
    $startDate: String!
    $endDate: String!
    $description: String
    $category: String
  ) {
    createProject(
      title: $title
      startDate: $startDate
      endDate: $endDate
      description: $description
      category: $category
    ) {
      id
      description
      endDate
      startDate
      status
      category
      title
    }
  }
`;

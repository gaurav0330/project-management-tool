import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: UserRole!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
      email
      role
      token
    }
  }
`;

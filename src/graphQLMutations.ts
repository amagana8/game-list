import { gql } from '@apollo/client';

export const SignUp = gql`
  mutation SignUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password)
  }
`;

export const SignIn = gql`
  mutation SignUp($username: String!, $password: String!) {
    signIn(username: $username, password: $password)
  }
`;

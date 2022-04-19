import { gql } from '@apollo/client';

export const SignUp = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password)
  }
`;

export const SignIn = gql`
  mutation SignUp($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

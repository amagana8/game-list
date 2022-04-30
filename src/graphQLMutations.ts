import { gql } from '@apollo/client';
import { GameFragment } from './graphQLFragments';

export const SignUp = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password)
  }
`;

export const SignIn = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

export const AddGame = gql`
  mutation UpdateUsers($where: UserWhere, $connect: UserConnectInput) {
    updateUsers(where: $where, connect: $connect) {
      info {
        relationshipsCreated
      }
    }
  }
`;

export const NewGame = gql`
  mutation CreateGames($input: [GameCreateInput!]!) {
    createGames(input: $input) {
      games {
        ...GameFragment
      }
    }
  }
  ${GameFragment}
`;

export const UpdateUserDetails = gql`
  mutation UpdateUserDetails(
    $username: String!
    $newUsername: String
    $newEmail: String
  ) {
    updateUserDetails(
      username: $username
      newUsername: $newUsername
      newEmail: $newEmail
    )
  }
`;

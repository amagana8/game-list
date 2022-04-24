import { gql } from '@apollo/client';

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
        id
        title
        developer
        publisher
        summary
        genre
      }
    }
  }
`;

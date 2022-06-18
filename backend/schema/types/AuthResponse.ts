import { gql } from 'apollo-server-micro';

export const AuthResponseTypeDef = gql`
  type AuthResponse @exclude {
    username: String!
    accessToken: String!
  }
`;

import { gql } from 'apollo-server-micro';

export const AuthResponseTypeDef = gql`
  type AuthResponse {
    username: String!
    accessToken: String!
  }
`;

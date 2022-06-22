import { gql } from 'apollo-server-micro';

export const platformTypeDef = gql`
  type Platform
    @exclude(operations: [DELETE])
    @auth(
      rules: [
        {
          operations: [CREATE, UPDATE, CONNECT, DISCONNECT]
          isAuthenticated: true
        }
      ]
    ) {
    id: ID! @id
    name: String!
    createdAt: DateTime @timestamp(operations: [CREATE])
    games: [Game!]! @relationship(type: "ON_PLATFORM", direction: IN)
  }
`;

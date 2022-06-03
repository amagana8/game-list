import { gql } from 'apollo-server-micro';

export const genreTypeDef = gql`
  type Genre
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
    games: [Game!]! @relationship(type: "IN_GENRE", direction: IN)
  }
`;

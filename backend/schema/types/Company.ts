import { gql } from 'apollo-server-micro';

export const companyTypeDef = gql`
  type Company
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
    gamesDeveloped: [Game!]! @relationship(type: "DEVELOPED_BY", direction: IN)
    gamesPublished: [Game!]! @relationship(type: "PUBLISHED_BY", direction: IN)
  }
`;

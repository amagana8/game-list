import { gql } from 'apollo-server-micro';

export const listEntryTypeDef = gql`
  interface ListEntry @relationshipProperties {
    status: Status!
    hours: Float
    score: Float
    platforms: [String!]!
    createdAt: DateTime! @timestamp(operations: [CREATE])
    updatedAt: DateTime @timestamp(operations: [UPDATE])
  }
`;

import { gql } from 'apollo-server-micro';

export const GenreCountTypeDef = gql`
  type GenreCount @exclude {
    genre: String!
    amount: Int!
  }
`;

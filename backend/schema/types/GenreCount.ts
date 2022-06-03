import { gql } from 'apollo-server-micro';

export const GenreCountTypeDef = gql`
  type GenreCount {
    genre: String!
    amount: Int!
  }
`;

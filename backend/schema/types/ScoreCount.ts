import { gql } from 'apollo-server-micro';

export const ScoreCountTypeDef = gql`
  type ScoreCount @exclude {
    score: Float!
    amount: Int!
  }
`;

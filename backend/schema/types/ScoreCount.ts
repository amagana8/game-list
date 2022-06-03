import { gql } from 'apollo-server-micro';

export const ScoreCountTypeDef = gql`
  type ScoreCount {
    score: Float!
    amount: Int!
  }
`;

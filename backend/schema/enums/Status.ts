import { gql } from 'apollo-server-micro';

export const statusTypeDef = gql`
  enum Status {
    PLAYING
    COMPLETED
    PAUSED
    DROPPED
    PLANNING
  }
`;

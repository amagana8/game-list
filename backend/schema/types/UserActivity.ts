import { gql } from 'apollo-server-micro';

export const userActivityTypeDef = gql`
  type UserActivity @exclude {
    user: String
    status: Status
    date: DateTime
    gameTitle: String
    gameSlug: String
    gameCover: String
  }
`;

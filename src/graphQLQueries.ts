import { gql } from '@apollo/client';

export const GetPlayingList = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      gamesPlayingConnection {
        edges {
          hours
          score
          node {
            id
            title
          }
        }
      }
    }
  }
`;

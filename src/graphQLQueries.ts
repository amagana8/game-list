import { gql } from '@apollo/client';
import { GameFragment } from './graphQLFragments';

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

export const GetGames = gql`
  query Games {
    games {
      id
      title
    }
  }
`;

export const GetGame = gql`
  query Games($where: GameWhere) {
    games(where: $where) {
      ...GameFragment
    }
  }
  ${GameFragment}
`;

export const GetUser = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      username
      email
    }
  }
`;

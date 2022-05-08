import { gql } from '@apollo/client';
import {
  GameFragment,
  GameStatusDistribution,
  GameScoreDistribution,
  UserStatusDistribution,
  UserScoreDistribution,
  UserStatsSummary,
  UserGenreDistribution,
} from './graphQLFragments';

export const GetList = gql`
  query Users(
    $where: UserWhere
    $gameListConnectionWhere: UserGameListConnectionWhere
  ) {
    users(where: $where) {
      gameListConnection(where: $gameListConnectionWhere) {
        edges {
          hours
          score
          status
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
      ...GameStatusDistribution
      ...GameScoreDistribution
    }
  }
  ${GameFragment}
  ${GameStatusDistribution}
  ${GameScoreDistribution}
`;

export const GetUser = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      username
      email
    }
  }
`;

export const GetGameStatus = gql`
  query Users(
    $where: UserWhere
    $gameListConnectionWhere2: UserGameListConnectionWhere
  ) {
    users(where: $where) {
      gameListConnection(where: $gameListConnectionWhere2) {
        edges {
          status
          hours
          score
        }
      }
    }
  }
`;

export const GetUserStats = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      ...UserStatusDistribution
      ...UserScoreDistribution
      ...UserStatsSummary
      ...UserGenreDistribution
    }
  }
  ${UserStatusDistribution}
  ${UserScoreDistribution}
  ${UserStatsSummary}
  ${UserGenreDistribution}
`;

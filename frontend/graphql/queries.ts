import { gql } from '@apollo/client';
import {
  GameFragment,
  GameStatusDistribution,
  GameScoreDistribution,
  UserStatusDistribution,
  UserScoreDistribution,
  UserStatsSummary,
  UserGenreDistribution,
  SmallGameFragment,
} from './fragments';

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
            ...SmallGameFragment
          }
        }
      }
    }
  }
  ${SmallGameFragment}
`;

export const GetGames = gql`
  query Games {
    games {
      ...SmallGameFragment
    }
  }
  ${SmallGameFragment}
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
    $gameListConnectionWhere: UserGameListConnectionWhere
  ) {
    users(where: $where) {
      gameListConnection(where: $gameListConnectionWhere) {
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

export const SearchGames = gql`
  query SearchGames($query: String) {
    searchGames(query: $query) {
      ...SmallGameFragment
    }
  }
  ${SmallGameFragment}
`;

export const SearchUsers = gql`
  query SearchUsers($query: String) {
    searchUsers(query: $query) {
      username
    }
  }
`;

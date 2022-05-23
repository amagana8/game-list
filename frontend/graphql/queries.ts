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
  GameReviews,
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
      ...GameReviews
    }
  }
  ${GameFragment}
  ${GameStatusDistribution}
  ${GameScoreDistribution}
  ${GameReviews}
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
    $gameReviewsWhere: ReviewWhere
  ) {
    users(where: $where) {
      gameListConnection(where: $gameListConnectionWhere) {
        edges {
          status
          hours
          score
        }
      }
      gameReviews(where: $gameReviewsWhere) {
        id
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

export const GetReviews = gql`
  query GameReviews($where: UserWhere) {
    users(where: $where) {
      gameReviews {
        id
        summary
        subject {
          slug
          title
        }
        author {
          username
        }
      }
    }
  }
`;

export const GetReview = gql`
  query Reviews($where: ReviewWhere) {
    reviews(where: $where) {
      id
      summary
      body
      createdAt
      updatedAt
      author {
        username
      }
      subject {
        slug
        title
      }
    }
  }
`;

import { gql } from '@apollo/client';
import {
  GameFragment,
  GameStatusDistribution,
  GameScoreDistribution,
  UserStatusDistribution,
  UserScoreDistribution,
  UserStatsSummary,
  SmallGameFragment,
  ReviewFragment,
  ListFragment,
} from './fragments';

export const GetList = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      Playing: gameListConnection(where: { edge: { status: playing } }) {
        ...ListFragment
      }
      Completed: gameListConnection(where: { edge: { status: completed } }) {
        ...ListFragment
      }
      Paused: gameListConnection(where: { edge: { status: paused } }) {
        ...ListFragment
      }
      Dropped: gameListConnection(where: { edge: { status: dropped } }) {
        ...ListFragment
      }
      Planning: gameListConnection(where: { edge: { status: planning } }) {
        ...ListFragment
      }
    }
  }
  ${ListFragment}
`;

export const GetGames = gql`
  query Games($options: GameOptions) {
    games(options: $options) {
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
      userReviews {
        ...ReviewFragment
      }
    }
  }
  ${GameFragment}
  ${GameStatusDistribution}
  ${GameScoreDistribution}
  ${ReviewFragment}
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
    }
  }
  ${UserStatusDistribution}
  ${UserScoreDistribution}
  ${UserStatsSummary}
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

export const GetUserReviews = gql`
  query GameReviews($where: UserWhere) {
    users(where: $where) {
      gameReviews {
        ...ReviewFragment
      }
    }
  }
  ${ReviewFragment}
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

export const GetReviews = gql`
  query Reviews($options: ReviewOptions) {
    reviews(options: $options) {
      ...ReviewFragment
    }
  }
  ${ReviewFragment}
`;

export const GetHomeInfo = gql`
  query GetHomeInfo(
    $userOptions: UserOptions
    $gamesOptions: GameOptions
    $reviewsOptions: ReviewOptions
  ) {
    users(options: $userOptions) {
      username
      gameListAggregate {
        edge {
          hours {
            sum
          }
        }
      }
    }
    games(options: $gamesOptions) {
      ...SmallGameFragment
    }
    reviews(options: $reviewsOptions) {
      ...ReviewFragment
    }
  }
  ${SmallGameFragment}
  ${ReviewFragment}
`;

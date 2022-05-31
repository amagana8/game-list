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
      Playing: gameListConnection(where: { edge: { status: PLAYING } }) {
        ...ListFragment
      }
      Completed: gameListConnection(where: { edge: { status: COMPLETED } }) {
        ...ListFragment
      }
      Paused: gameListConnection(where: { edge: { status: PAUSED } }) {
        ...ListFragment
      }
      Dropped: gameListConnection(where: { edge: { status: DROPPED } }) {
        ...ListFragment
      }
      Planning: gameListConnection(where: { edge: { status: PLANNING } }) {
        ...ListFragment
      }
    }
  }
  ${ListFragment}
`;

export const GetGames = gql`
  query Games($options: GameOptions, $where: GameWhere) {
    games(options: $options, where: $where) {
      ...SmallGameFragment
    }
  }
  ${SmallGameFragment}
`;

export const GetGame = gql`
  query Games($where: GameWhere, $options: ReviewOptions) {
    games(where: $where) {
      ...GameFragment
      ...GameStatusDistribution
      ...GameScoreDistribution
      userReviews(options: $options) {
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
      genreDistribution {
        genre
        amount
      }
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

export const SearchCompanies = gql`
  query SearchCompanies($query: String) {
    searchCompanies(query: $query) {
      id
      name
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
  query Reviews($options: ReviewOptions, $where: ReviewWhere) {
    reviews(options: $options, where: $where) {
      ...ReviewFragment
    }
  }
  ${ReviewFragment}
`;

export const GetHomeInfo = gql`
  query GetHomeInfo(
    $gameWhere: GameWhere
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
    games(options: $gamesOptions, where: $gameWhere) {
      ...SmallGameFragment
    }
    reviews(options: $reviewsOptions) {
      ...ReviewFragment
    }
  }
  ${SmallGameFragment}
  ${ReviewFragment}
`;

export const GetGenres = gql`
  query Genres {
    genres {
      id
      name
    }
  }
`;

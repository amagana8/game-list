import { gql } from '@apollo/client';
import {
  GameFragment,
  GameStatusDistribution,
  UserStatusDistribution,
  UserStatsSummary,
  SmallGameFragment,
  ReviewFragment,
  ListFragment,
} from './fragments';

export const GetList = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      gameListConnection {
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
      userListAggregate {
        edge {
          score {
            average
          }
        }
      }
      scoreDistribution {
        score
        amount
      }
      userReviews(options: $options) {
        ...ReviewFragment
      }
    }
  }
  ${GameFragment}
  ${GameStatusDistribution}
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
    $favoriteGamesWhere: GameWhere
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
      favoriteGames(where: $favoriteGamesWhere) {
        id
      }
    }
  }
`;

export const GetUserStats = gql`
  query Users($where: UserWhere) {
    users(where: $where) {
      ...UserStatusDistribution
      ...UserStatsSummary
      scoreDistribution {
        score
        amount
      }
      genreDistribution {
        genre
        amount
      }
    }
  }
  ${UserStatusDistribution}
  ${UserStatsSummary}
`;

export const SearchGames = gql`
  query Games($fulltext: GameFulltext, $options: GameOptions) {
    games(fulltext: $fulltext, options: $options) {
      ...SmallGameFragment
    }
  }
  ${SmallGameFragment}
`;

export const SearchUsers = gql`
  query Users($fulltext: UserFulltext, $options: UserOptions) {
    users(fulltext: $fulltext, options: $options) {
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
    $userOptions: UserOptions
    $gamesLimit: Int = 50
    $gamesOffset: Int = 0
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
    topGames(limit: $gamesLimit, offset: $gamesOffset) {
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

export const GetFavoriteGames = gql`
  query FavoriteGames($where: UserWhere) {
    users(where: $where) {
      favoriteGames {
        ...SmallGameFragment
      }
    }
  }
  ${SmallGameFragment}
`;

export const GetTopGames = gql`
  query TopGames($limit: Int = 50, $offset: Int = 0) {
    topGames(limit: $limit, offset: $offset) {
      ...SmallGameFragment
    }
  }
  ${SmallGameFragment}
`;

export const GetPlatforms = gql`
  query Platforms {
    platforms {
      name
      id
    }
  }
`;

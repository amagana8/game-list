import { gql } from '@apollo/client';

export const GameFragment = gql`
  fragment GameFragment on Game {
    id
    title
    cover
    developers
    publishers
    summary
    genre
  }
`;

export const SmallGameFragment = gql`
  fragment SmallGameFragment on Game {
    id
    title
    cover
  }
`;

export const GameStatusDistribution = gql`
  fragment GameStatusDistribution on Game {
    usersPlaying: userListConnection(where: { edge: { status: playing } }) {
      totalCount
    }
    usersCompleted: userListConnection(where: { edge: { status: completed } }) {
      totalCount
    }
    usersPaused: userListConnection(where: { edge: { status: paused } }) {
      totalCount
    }
    usersDropped: userListConnection(where: { edge: { status: dropped } }) {
      totalCount
    }
    usersPlanning: userListConnection(where: { edge: { status: planning } }) {
      totalCount
    }
  }
`;

export const GameScoreDistribution = gql`
  fragment GameScoreDistribution on Game {
    userListAggregate {
      edge {
        score {
          average
        }
      }
    }
    score_ones: userListConnection(where: { edge: { score: 1 } }) {
      totalCount
    }
    score_twos: userListConnection(where: { edge: { score: 2 } }) {
      totalCount
    }
    score_threes: userListConnection(where: { edge: { score: 3 } }) {
      totalCount
    }
    score_fours: userListConnection(where: { edge: { score: 4 } }) {
      totalCount
    }
    score_fives: userListConnection(where: { edge: { score: 5 } }) {
      totalCount
    }
    score_sixes: userListConnection(where: { edge: { score: 6 } }) {
      totalCount
    }
    score_sevens: userListConnection(where: { edge: { score: 7 } }) {
      totalCount
    }
    score_eights: userListConnection(where: { edge: { score: 8 } }) {
      totalCount
    }
    score_nines: userListConnection(where: { edge: { score: 9 } }) {
      totalCount
    }
    score_tens: userListConnection(where: { edge: { score: 10 } }) {
      totalCount
    }
  }
`;

export const UserStatusDistribution = gql`
  fragment UserStatusDistribution on User {
    gamesPlaying: gameListConnection(where: { edge: { status: playing } }) {
      totalCount
    }
    gamesCompleted: gameListConnection(where: { edge: { status: completed } }) {
      totalCount
    }
    gamesPaused: gameListConnection(where: { edge: { status: paused } }) {
      totalCount
    }
    gamesDropped: gameListConnection(where: { edge: { status: dropped } }) {
      totalCount
    }
    gamesPlanning: gameListConnection(where: { edge: { status: planning } }) {
      totalCount
    }
  }
`;

export const UserScoreDistribution = gql`
  fragment UserScoreDistribution on User {
    score_ones: gameListConnection(where: { edge: { score: 1 } }) {
      totalCount
    }
    score_twos: gameListConnection(where: { edge: { score: 2 } }) {
      totalCount
    }
    score_threes: gameListConnection(where: { edge: { score: 3 } }) {
      totalCount
    }
    score_fours: gameListConnection(where: { edge: { score: 4 } }) {
      totalCount
    }
    score_fives: gameListConnection(where: { edge: { score: 5 } }) {
      totalCount
    }
    score_sixes: gameListConnection(where: { edge: { score: 6 } }) {
      totalCount
    }
    score_sevens: gameListConnection(where: { edge: { score: 7 } }) {
      totalCount
    }
    score_eights: gameListConnection(where: { edge: { score: 8 } }) {
      totalCount
    }
    score_nines: gameListConnection(where: { edge: { score: 9 } }) {
      totalCount
    }
    score_tens: gameListConnection(where: { edge: { score: 10 } }) {
      totalCount
    }
  }
`;

export const UserStatsSummary = gql`
  fragment UserStatsSummary on User {
    gameListConnection(where: { edge: { status_NOT: planning } }) {
      totalCount
    }
    gameListAggregate {
      edge {
        hours {
          sum
          average
        }
        score {
          average
        }
      }
    }
  }
`;

export const UserGenreDistribution = gql`
  fragment UserGenreDistribution on User {
    genre_adventure: gameListConnection(where: { node: { genre: adventure } }) {
      totalCount
    }
    genre_board: gameListConnection(where: { node: { genre: board } }) {
      totalCount
    }
    genre_fighting: gameListConnection(where: { node: { genre: fighting } }) {
      totalCount
    }
    genre_horror: gameListConnection(where: { node: { genre: horror } }) {
      totalCount
    }
    genre_racing: gameListConnection(where: { node: { genre: racing } }) {
      totalCount
    }
    genre_rpg: gameListConnection(where: { node: { genre: rpg } }) {
      totalCount
    }
    genre_rhythm: gameListConnection(where: { node: { genre: rhythm } }) {
      totalCount
    }
    genre_sandbox: gameListConnection(where: { node: { genre: sandbox } }) {
      totalCount
    }
    genre_shooter: gameListConnection(where: { node: { genre: shooter } }) {
      totalCount
    }
    genre_simulation: gameListConnection(
      where: { node: { genre: simulation } }
    ) {
      totalCount
    }
    genre_sports: gameListConnection(where: { node: { genre: sports } }) {
      totalCount
    }
    genre_strategy: gameListConnection(where: { node: { genre: strategy } }) {
      totalCount
    }
  }
`;

import { gql } from '@apollo/client';

export const GameFragment = gql`
  fragment GameFragment on Game {
    id
    slug
    title
    cover
    developers {
      name
    }
    publishers {
      name
    }
    summary
    genres {
      name
    }
    releaseDate
  }
`;

export const SmallGameFragment = gql`
  fragment SmallGameFragment on Game {
    id
    slug
    title
    cover
  }
`;

export const ReviewFragment = gql`
  fragment ReviewFragment on Review {
    id
    summary
    subject {
      title
      slug
    }
    author {
      username
    }
  }
`;

export const ListFragment = gql`
  fragment ListFragment on UserGameListConnection {
    edges {
      hours
      score
      status
      node {
        ...SmallGameFragment
      }
    }
  }
  ${SmallGameFragment}
`;

export const GameStatusDistribution = gql`
  fragment GameStatusDistribution on Game {
    usersPlaying: userListConnection(where: { edge: { status: PLAYING } }) {
      totalCount
    }
    usersCompleted: userListConnection(where: { edge: { status: COMPLETED } }) {
      totalCount
    }
    usersPaused: userListConnection(where: { edge: { status: PAUSED } }) {
      totalCount
    }
    usersDropped: userListConnection(where: { edge: { status: DROPPED } }) {
      totalCount
    }
    usersPlanning: userListConnection(where: { edge: { status: PLANNING } }) {
      totalCount
    }
  }
`;

export const UserStatusDistribution = gql`
  fragment UserStatusDistribution on User {
    gamesPlaying: gameListConnection(where: { edge: { status: PLAYING } }) {
      totalCount
    }
    gamesCompleted: gameListConnection(where: { edge: { status: COMPLETED } }) {
      totalCount
    }
    gamesPaused: gameListConnection(where: { edge: { status: PAUSED } }) {
      totalCount
    }
    gamesDropped: gameListConnection(where: { edge: { status: DROPPED } }) {
      totalCount
    }
    gamesPlanning: gameListConnection(where: { edge: { status: PLANNING } }) {
      totalCount
    }
  }
`;

export const UserStatsSummary = gql`
  fragment UserStatsSummary on User {
    createdAt
    gameListConnection(where: { edge: { status_NOT: PLANNING } }) {
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

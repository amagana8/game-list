import { gql } from '@apollo/client';

export const GameFragment = gql`
  fragment GameFragment on Game {
    id
    title
    developers
    publishers
    summary
    genre
  }
`;

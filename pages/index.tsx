import { HomePage } from '@pages/home/HomePage';
import {
  GetSortedGames,
  GetSortedReviews,
  GetSortedUsers,
} from '@graphql/queries';
import { client } from '@frontend/apollo-client';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: ReviewData } = await client.query({
    query: GetSortedReviews,
    variables: {
      options: {
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    },
  });

  const { data: GameData } = await client.query({
    query: GetSortedGames,
    variables: {
      options: {
        sort: [
          {
            releaseDate: 'DESC',
          },
        ],
      },
    },
  });

  const { data: UserData } = await client.query({
    query: GetSortedUsers,
    variables: {
      options: {
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    },
  });

  return {
    props: {
      reviews: ReviewData.reviews,
      games: GameData.games,
      users: UserData.users,
    },
  };
};

export default HomePage;

import { GamePage } from '@pages/game/GamePage';
import type { GetServerSideProps } from 'next';
import { client } from '@frontend/apollo-client';
import { GetGame } from '@graphql/queries';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug } = query;
  const { data } = await client.query({
    query: GetGame,
    variables: {
      where: {
        slug,
      },
      options: {
        limit: 10,
        sort: [{ createdAt: 'DESC' }],
      },
    },
  });

  return {
    props: {
      game: data.games[0],
    },
  };
};

export default GamePage;

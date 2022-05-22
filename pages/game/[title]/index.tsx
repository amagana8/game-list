import { GamePage } from '@pages/game/GamePage';
import type { GetServerSideProps } from 'next';
import { client } from '@frontend/apollo-client';
import { GetGame } from '@graphql/queries';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { title } = query;
  const { data } = await client.query({
    query: GetGame,
    variables: {
      where: {
        title: title,
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

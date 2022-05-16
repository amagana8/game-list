import { client } from '@frontend/apollo-client';
import { SearchGames } from '@graphql/queries';
import { GameSearchPage } from '@pages/gameSearch/GameSearchPage';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { search } = query;
  const { data } = await client.query({
    query: SearchGames,
    variables: {
      query: search,
    },
  });

  return {
    props: {
      games: data.searchGames,
    },
  };
};

export default GameSearchPage;

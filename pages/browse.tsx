import { client } from '@frontend/apollo-client';
import { BrowsePage } from '@pages/browse/BrowsePage';
import { GetServerSideProps } from 'next';
import { GetGames } from '@graphql/queries';

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await client.query({
    query: GetGames,
    variables: {
      options: {
        limit: 50,
        sort: [{ releaseDate: 'DESC' }],
      },
    },
  });

  return {
    props: {
      games: data.games,
    },
  };
};

export default BrowsePage;

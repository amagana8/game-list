import { client } from '@frontend/apollo-client';
import { GetGenres } from '@graphql/queries';
import { AddGamePage } from '@pages/addGame/AddGamePage';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({ query: GetGenres });

  return {
    props: {
      genres: data.genres,
    },
  };
};

export default AddGamePage;

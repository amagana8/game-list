import { client } from '@frontend/apollo-client';
import { SearchUsers } from '@graphql/queries';
import { UserSearchPage } from '@pages/userSearch/UserSearchPage';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { search } = query;
  const { data } = await client.query({
    query: SearchUsers,
    variables: {
      query: search,
    },
  });

  return {
    props: {
      users: data.searchUsers,
    },
  };
};

export default UserSearchPage;

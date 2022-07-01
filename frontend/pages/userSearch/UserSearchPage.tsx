import Head from 'next/head';
import { initializeApollo } from '@frontend/apollo-client';
import { SearchUsers } from '@graphql/queries';
import { GetServerSideProps } from 'next';
import Title from 'antd/lib/typography/Title';
import { UserList } from '@components/userList/UserList';
import { User } from '@utils/types';

interface UserSearchPageProps {
  users: User[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
  const { search } = query;
  const { data } = await client.query({
    query: SearchUsers,
    variables: {
      fulltext: {
        userName: {
          phrase: search,
        },
      },
      options: {
        limit: 50,
      },
    },
  });

  return {
    props: {
      users: data.users,
    },
  };
};

const UserSearchPage = ({ users }: UserSearchPageProps) => {
  return (
    <>
      <Head>
        <title>Search Users · GameList</title>
      </Head>
      <Title>Users</Title>
      <UserList users={users} />
    </>
  );
};

export { getServerSideProps, UserSearchPage };

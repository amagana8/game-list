import { List } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { initializeApollo } from '@frontend/apollo-client';
import { SearchUsers } from '@graphql/queries';
import { GetServerSideProps } from 'next';
import Title from 'antd/lib/typography/Title';

interface User {
  username: string;
}

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
      <List
        dataSource={users.map((row: User) => row.username)}
        renderItem={(username: string) => (
          <List.Item>
            <Link href={`/user/${username}`}>
              <a>{username}</a>
            </Link>
          </List.Item>
        )}
      />
    </>
  );
};

export { getServerSideProps, UserSearchPage };

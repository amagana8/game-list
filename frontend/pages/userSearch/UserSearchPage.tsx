import { NavBar } from '@components/navBar/NavBar';
import { setSearchLoading } from '@slices/searchSlice';
import { useAppDispatch } from '@utils/hooks';
import { Layout, List, Typography } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { initializeApollo } from '@frontend/apollo-client';
import { SearchUsers } from '@graphql/queries';
import { GetServerSideProps } from 'next';

const { Content } = Layout;
const { Title } = Typography;

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
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSearchLoading(false));
  }, [users, dispatch]);

  return (
    <>
      <Head>
        <title>Search Users · GameList</title>
      </Head>
      <NavBar index="" />
      <Content>
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
      </Content>
    </>
  );
};

export { getServerSideProps, UserSearchPage };

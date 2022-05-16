import { NavBar } from '@components/navBar/NavBar';
import { setSearchLoading } from '@slices/searchSlice';
import { useAppDispatch } from '@utils/hooks';
import { Layout, List, Typography } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

const { Content } = Layout;
const { Title } = Typography;

interface User {
  username: string;
}

interface UserSearchPageProps {
  users: User[];
}

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
              <Link href={`/profile/${username}`}>
                <a>{username}</a>
              </Link>
            </List.Item>
          )}
        />
      </Content>
    </>
  );
};

export { UserSearchPage };

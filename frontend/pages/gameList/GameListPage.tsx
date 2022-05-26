import type { NextPage } from 'next';
import { Layout, Menu } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import { GameTable } from '@components/gameTable/GameTable';
import Link from 'next/link';
import styles from './GameListPage.module.scss';
import { Status } from '@utils/enums';
import { useRouter } from 'next/router';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import Head from 'next/head';
import { GetList } from '@graphql/queries';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

const { Content, Sider } = Layout;

const GameListPage: NextPage = () => {
  const { username } = useRouter().query;
  const { loading, data } = useQuery(GetList, {
    variables: {
      where: {
        username,
      },
    },
  });
  return (
    <>
      <Head>
        <title>{`${username}'s List · GameList`}</title>
      </Head>
      <NavBar index="3" />
      <Layout>
        <Sider width={0}>
          <Menu mode="vertical" className={styles.sideBar}>
            <Menu.Item>
              <Link href="#playing">
                <a>Playing</a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="#completed">
                <a>Completed</a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="#paused">
                <a>Paused</a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="#dropped">
                <a>Dropped</a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="#planning">
                <a>Planning</a>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>
          <UserPageNavBar username={username} index="2" />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <GameTable
                status={Status.Playing}
                data={data.users[0].Playing.edges}
              />
              <GameTable
                status={Status.Completed}
                data={data.users[0].Completed.edges}
              />
              <GameTable
                status={Status.Paused}
                data={data.users[0].Paused.edges}
              />
              <GameTable
                status={Status.Dropped}
                data={data.users[0].Dropped.edges}
              />
              <GameTable
                status={Status.Planning}
                data={data.users[0].Planning.edges}
              />
            </>
          )}
        </Content>
      </Layout>
    </>
  );
};

export { GameListPage };

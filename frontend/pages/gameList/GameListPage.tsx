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

const { Content, Sider } = Layout;

const GameListPage: NextPage = () => {
  const { username } = useRouter().query;
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
          <GameTable status={Status.Playing} />
          <GameTable status={Status.Completed} />
          <GameTable status={Status.Paused} />
          <GameTable status={Status.Dropped} />
          <GameTable status={Status.Planning} />
        </Content>
      </Layout>
    </>
  );
};

export { GameListPage };

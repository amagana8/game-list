import type { NextPage } from 'next';
import { Layout, Menu } from 'antd';
import { NavBar } from '@components/navBar';
import { GameTable } from '@components/gameTable';
import Link from 'next/link';
import styles from '@styles/gameList.module.scss';

const { Content, Sider } = Layout;

const GameList: NextPage = () => {
  return (
    <>
      <NavBar index="3" />
      <Layout>
        <Sider>
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
          <GameTable status="playing" />
          <GameTable status="completed" />
          <GameTable status="paused" />
          <GameTable status="dropped" />
          <GameTable status="planning" />
        </Content>
      </Layout>
    </>
  );
};

export default GameList;

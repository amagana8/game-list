import type { NextPage } from 'next';
import { Button, Layout, Menu } from 'antd';
import { NavBar } from '@components/navBar';
import { GameTable } from '@components/gameTable';
import Link from 'next/link';
import styles from '@styles/gameList.module.scss';
import { Status } from 'src/enums';
import { Typography } from 'antd';
import { useRouter } from 'next/router';

const { Content, Sider } = Layout;
const { Title } = Typography;

const GameList: NextPage = () => {
  const { username } = useRouter().query;
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
          <Title className={styles.title}>{username}</Title>
          <Button type="primary" className={styles.profileButton}>
            <Link href={`/profile/${username}`}>
              <a>Profile</a>
            </Link>
          </Button>
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

export default GameList;

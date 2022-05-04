import Link from 'next/link';
import { Button, Layout, Menu, Popover, Space } from 'antd';
import styles from '@styles/NavBar.module.scss';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { logout } from '../slices/userSlice';
import Router from 'next/router';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;

type navBarProps = {
  index: string;
};

const defaultProps: navBarProps = {
  index: '',
};

const NavBar = ({ index }: navBarProps) => {
  const username = useAppSelector((state) => state.user.username);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Router.push('/');
  };

  const content = (
    <Space direction="vertical">
      <Link href={`/profile/${username}`}>
        <a>
          <Button className={styles.popoverButton} icon={<UserOutlined />}>
            Profile
          </Button>
        </a>
      </Link>
      <Link href="/settings">
        <a>
          <Button className={styles.popoverButton} icon={<SettingOutlined />}>
            Settings
          </Button>
        </a>
      </Link>
      <Button className={styles.popoverButton} onClick={handleLogout}>
        Logout
      </Button>
    </Space>
  );

  return (
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[index]}>
        <Menu.Item key="1">
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link href="/browse">
            <a>Browse</a>
          </Link>
        </Menu.Item>
        {username ? (
          <>
            <Menu.Item key="3">
              <Link href={`/gameList/${username}`}>
                <a>My List</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link href="/addGame">
                <a>New Game</a>
              </Link>
            </Menu.Item>
            <Popover content={content} trigger="click">
              <div className={styles.right}>
                <UserOutlined className={styles.profileIcon} />
              </div>
            </Popover>
          </>
        ) : (
          <>
            <Menu.Item key="5" className={styles.end}>
              <Button>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </Button>
            </Menu.Item>
            <Menu.Item key="6">
              <Button type="primary">
                <Link href="/signup">
                  <a>Sign Up</a>
                </Link>
              </Button>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
};

NavBar.defaultProps = defaultProps;

export { NavBar };

import Link from 'next/link';
import { Button, Layout, Menu } from 'antd';
import styles from '@styles/NavBar.module.scss';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { logout } from '../slices/userSlice';
import Router from 'next/router';

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
              <Link href={`/addGame`}>
                <a>New Game</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="5" className={styles.end}>
              <Button onClick={handleLogout}>Logout</Button>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="6" className={styles.end}>
              <Button>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </Button>
            </Menu.Item>
            <Menu.Item key="7">
              <Button>
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

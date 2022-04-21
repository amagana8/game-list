import Link from 'next/link';
import { Button, Layout, Menu } from 'antd';
import { useState, useEffect } from 'react';
import styles from '@styles/NavBar.module.css';
import { useAppDispatch } from 'src/hooks';
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
  const [username, setUsername] = useState<string>();
  useEffect(() => {
    setUsername(localStorage.getItem('username') ?? '');
  }, [username]);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch(logout());
    setUsername('');
    Router.push('/');;
  }
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
                <a>Game List</a>
              </Link>
            </Menu.Item>
            <Menu.Item className={styles.end}>
              <Button onClick={handleLogout}>Logout</Button>
            </Menu.Item>
          </>
        ) : (
          <>
          <Menu.Item className={styles.end}>
            <Button>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </Button>
          </Menu.Item>
          <Menu.Item>
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

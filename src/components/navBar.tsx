import Link from 'next/link';
import { useEffect } from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

type navBarProps = {
  index: string;
};

const defaultProps: navBarProps = {
  index: '',
};

const NavBar = ({ index }: navBarProps) => {
  let user;
  useEffect(() => {
    user = localStorage.getItem('user');
  }, []);

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
        <Menu.Item key="3">
          <Link href={`/gameList/${user}`}>
            <a>Game List</a>
          </Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

NavBar.defaultProps = defaultProps;

export { NavBar };

import { Menu, Typography } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

const UserPageNavBar = ({ username, index }: any) => (
  <>
    <Title>{username}</Title>
    <Menu mode="horizontal" defaultSelectedKeys={[index]}>
      <Menu.Item key="1">
        <Link href={`/user/${username}`}>
          <a>Profile</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href={`/user/${username}/gamelist`}>
          <a>Game List</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link href={`/user/${username}/favorites`}>
          <a>Favorites</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link href={`/user/${username}/reviews`}>
          <a>Reviews</a>
        </Link>
      </Menu.Item>
    </Menu>
  </>
);

export { UserPageNavBar };

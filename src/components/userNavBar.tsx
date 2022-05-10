import { Menu, Typography } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

const UserNavBar = ({ username, index }: any) => (
  <>
    <Title>{username}</Title>
    <Menu mode="horizontal" defaultSelectedKeys={[index]}>
      <Menu.Item key="1">
        <Link href={`/profile/${username}`}>
          <a>Profile</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href={`/gameList/${username}`}>
          <a>Game List</a>
        </Link>
      </Menu.Item>
    </Menu>
  </>
);

export { UserNavBar };

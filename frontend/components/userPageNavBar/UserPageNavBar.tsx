import { Menu } from 'antd';
import Title from 'antd/lib/typography/Title';
import Link from 'next/link';

interface UserPageNavBarProps {
  username: string;
  index: string;
}

const UserPageNavBar = ({ username, index }: UserPageNavBarProps) => {
  const items = [
    {
      label: (
        <Link href={`/user/${username}`}>
          <a>Profile</a>
        </Link>
      ),
      key: 'Profile',
    },
    {
      label: (
        <Link href={`/user/${username}/gamelist`}>
          <a>Game List</a>
        </Link>
      ),
      key: 'Game List',
    },
    {
      label: (
        <Link href={`/user/${username}/favorites`}>
          <a>Favorites</a>
        </Link>
      ),
      key: 'Favorites',
    },
    {
      label: (
        <Link href={`/user/${username}/reviews`}>
          <a>Reviews</a>
        </Link>
      ),
      key: 'Reviews',
    },
  ];

  const currentItem = items.find((item) => item.key === index);
  if (currentItem) {
    currentItem.label = <>{currentItem.key}</>;
  }

  return (
    <>
      <Title>{username}</Title>
      <Menu mode="horizontal" defaultSelectedKeys={[index]} items={items} />
    </>
  );
};

export { UserPageNavBar };

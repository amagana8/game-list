import { useMutation, useQuery } from '@apollo/client';
import { useAuthStore } from '@frontend/authStore';
import { FollowUser, UnFollowUser } from '@graphql/mutations';
import { GetIsFollowing } from '@graphql/queries';
import { Button, Menu, message } from 'antd';
import Title from 'antd/lib/typography/Title';
import Link from 'next/link';
import { useState } from 'react';
import styles from './UserPageNavBar.module.scss';

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
    {
      label: (
        <Link href={`/user/${username}/social`}>
          <a>Social</a>
        </Link>
      ),
      key: 'Social',
    },
  ];

  const currentUser = useAuthStore((state) => state.username);

  const [following, setFollowing] = useState(false);

  const { loading } = useQuery(GetIsFollowing, {
    variables: {
      follower: currentUser,
      followee: username,
    },
    onCompleted: (data) => {
      setFollowing(data.isFollowing);
    },
  });

  const [followUser] = useMutation(FollowUser);
  const follow = async () => {
    try {
      const { data } = await followUser({
        variables: {
          user: username,
        },
      });
      setFollowing(true);
      if (data.follow) {
        message.success(`Following ${username}`);
      } else {
        message.error('Follow Failed');
      }
    } catch (error) {
      console.log(error);
      message.error('Follow Failed');
    }
  };

  const [unFollowUser] = useMutation(UnFollowUser);
  const unFollow = async () => {
    try {
      const { data } = await unFollowUser({
        variables: {
          user: username,
        },
      });
      setFollowing(false);
      if (data.unFollow) {
        message.success(`Unfollowed ${username}`);
      } else {
        message.error('Unfollow failed');
      }
    } catch (error) {
      console.log(error);
      message.error('Unfollow failed');
    }
  };

  return (
    <>
      <Title className={styles.title}>{username}</Title>
      {currentUser !== username && (
        <Button
          type="primary"
          className={styles.button}
          onClick={following ? unFollow : follow}
          loading={loading}
        >
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}
      <Menu mode="horizontal" defaultSelectedKeys={[index]} items={items} />
    </>
  );
};

export { UserPageNavBar };

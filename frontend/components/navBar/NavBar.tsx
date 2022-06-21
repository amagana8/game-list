import Link from 'next/link';
import { Button, Menu, Popover, Space, Select, message } from 'antd';
import styles from './NavBar.module.scss';
import Router from 'next/router';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { SearchType } from '@utils/enums';
import Image from 'next/image';
import { useState } from 'react';
import { useAuthStore } from '@frontend/authStore';
import { useMutation } from '@apollo/client';
import { SignOut } from '@graphql/mutations';
import Search from 'antd/lib/input/Search';

const NavBar = () => {
  const username = useAuthStore((state) => state.username);
  const resetUser = useAuthStore((state) => state.resetUser);
  const [searchType, setSearchType] = useState(SearchType.Games);
  const [signOut] = useMutation(SignOut);

  const onSearch = (query: string) => {
    Router.push(`/search/${searchType}?search=${query}`);
  };

  const handleLogout = async () => {
    resetUser();
    await signOut();
    message.success('You have been successfully logged out.');
    Router.push('/');
  };

  const content = (
    <Space direction="vertical">
      <Link href={`/user/${username}`}>
        <a>
          <Button className={styles.popoverButton} icon={<UserOutlined />}>
            Profile
          </Button>
        </a>
      </Link>
      <Button
        href="/settings"
        className={styles.popoverButton}
        icon={<SettingOutlined />}
      >
        Settings
      </Button>
      <Button
        className={styles.popoverButton}
        icon={<HeartOutlined />}
        href="https://ko-fi.com/amagana8"
        target="_blank"
      >
        Donate
      </Button>
      <Button
        className={styles.popoverButton}
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Space>
  );

  const searchTypeSelect = (
    <Select
      defaultValue={searchType}
      onChange={(option) => setSearchType(option)}
    >
      <Select.Option value={SearchType.Games}>Games</Select.Option>
      <Select.Option value={SearchType.Users}>Users</Select.Option>
    </Select>
  );

  let items = [
    {
      label: (
        <Link href="/">
          <a>Home</a>
        </Link>
      ),
      key: 'home',
    },
    {
      label: (
        <Link href="/browse">
          <a>Browse</a>
        </Link>
      ),
      key: 'browse',
    },
  ];

  const loggedInItems = [
    {
      label: (
        <Link href={`/user/${username}/gamelist`}>
          <a>My List</a>
        </Link>
      ),
      key: 'game-list',
    },
    {
      label: (
        <Link href="/addGame">
          <a>New Game</a>
        </Link>
      ),
      key: 'add-game',
    },
  ];

  if (username) {
    items = items.concat(loggedInItems);
  }

  return (
    <>
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image src="/logo.png" width={36} height={36} alt="GameList Logo" />
          </a>
        </Link>
      </div>
      <Menu theme="dark" mode="horizontal" items={items} />
      <Space size="large" className={styles.right}>
        <Search
          onSearch={onSearch}
          className={styles.search}
          addonBefore={searchTypeSelect}
          enterButton
        />
        {username ? (
          <Popover content={content} trigger="click">
            <UserOutlined className={styles.profileIcon} />
          </Popover>
        ) : (
          <>
            <Button>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </Button>
            <Button type="primary">
              <Link href="/signup">
                <a>Sign Up</a>
              </Link>
            </Button>
          </>
        )}
      </Space>
    </>
  );
};

export { NavBar };

import Link from 'next/link';
import { Button, Menu, Popover, Space, Input, Select } from 'antd';
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
import { getUser, setUser } from '@frontend/user';
import { useMutation } from '@apollo/client';
import { SignOut } from '@graphql/mutations';

const { Search } = Input;
const { Option } = Select;

const NavBar = () => {
  const username = getUser().username;
  const [searchType, setSearchType] = useState(SearchType.Games);
  const [signOut] = useMutation(SignOut);

  const onSearch = (query: string) => {
    Router.push(`/search/${searchType}?search=${query}`);
  };

  const handleLogout = async () => {
    setUser({ username: '', accessToken: '' });
    await signOut();
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
      <Link href="/settings">
        <a>
          <Button className={styles.popoverButton} icon={<SettingOutlined />}>
            Settings
          </Button>
        </a>
      </Link>
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
      <Option value={SearchType.Games}>Games</Option>
      <Option value={SearchType.Users}>Users</Option>
    </Select>
  );

  return (
    <Menu theme="dark" mode="horizontal">
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image src="/logo.png" width={36} height={36} alt="GameList Logo" />
          </a>
        </Link>
      </div>
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
      {username && (
        <>
          <Menu.Item key="3">
            <Link href={`/user/${username}/gamelist`}>
              <a>My List</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href="/addGame">
              <a>New Game</a>
            </Link>
          </Menu.Item>
        </>
      )}
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
    </Menu>
  );
};

export { NavBar };

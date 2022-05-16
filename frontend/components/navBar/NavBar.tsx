import Link from 'next/link';
import { Button, Layout, Menu, Popover, Space, Input, Select } from 'antd';
import styles from './NavBar.module.scss';
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { logout } from '@slices/userSlice';
import Router from 'next/router';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { setSearchType, setSearchLoading } from '@slices/searchSlice';
import { SearchType } from '@utils/enums';

const { Header } = Layout;
const { Search } = Input;
const { Option } = Select;

type navBarProps = {
  index: string;
};

const defaultProps: navBarProps = {
  index: '',
};

const NavBar = ({ index }: navBarProps) => {
  const username = useAppSelector((state) => state.user.username);
  const searchType = useAppSelector((state) => state.search.type);
  const searchLoading = useAppSelector((state) => state.search.loading);
  const dispatch = useAppDispatch();

  const onSearch = (query: string) => {
    dispatch(setSearchLoading(true));
    Router.push(`/search/${searchType}?search=${query}`);
  };

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

  const searchTypeSelect = (
    <Select
      defaultValue={searchType}
      onChange={(option) => dispatch(setSearchType(option))}
    >
      <Option value={SearchType.Games}>Games</Option>
      <Option value={SearchType.Users}>Users</Option>
    </Select>
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
        {username && (
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
          </>
        )}
        <Space size="large" className={styles.right}>
          <Search
            onSearch={onSearch}
            className={styles.search}
            addonBefore={searchTypeSelect}
            loading={searchLoading}
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
    </Header>
  );
};

NavBar.defaultProps = defaultProps;

export { NavBar };

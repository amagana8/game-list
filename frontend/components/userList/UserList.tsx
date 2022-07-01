import { User } from '@utils/types';
import { List } from 'antd';
import Link from 'next/link';

interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => {
  return (
    <List
      dataSource={users.map((row: User) => row.username)}
      renderItem={(username: string) => (
        <List.Item>
          <Link href={`/user/${username}`}>
            <a>{username}</a>
          </Link>
        </List.Item>
      )}
    />
  );
};

export { UserList };

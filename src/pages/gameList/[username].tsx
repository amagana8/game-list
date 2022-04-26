import type { NextPage } from 'next';
import { Layout, Table } from 'antd';
import { NavBar } from '@components/navBar';
import { GetPlayingList } from '../../graphQLQueries';
import { useQuery } from '@apollo/client';
import { useAppSelector } from 'src/hooks';
import { LoadingSpinner } from '@components/loadingSpinner';

const { Content } = Layout;

interface Game {
  id: string;
  title: string;
}
interface ListEntry {
  hours: Number;
  score: Number;
  node: Game;
}

const GameList: NextPage = () => {
  const username = useAppSelector((state) => state.user.username);

  const { loading, data } = useQuery(GetPlayingList, {
    variables: {
      where: {
        username: username,
      },
    },
  });

  const list = data?.users[0]?.gamesPlayingConnection.edges ?? [];

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Score',
      dataIndex: 'score',
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
    },
  ];
  return (
    <>
      <NavBar index="3" />
      <Content>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Table
            columns={columns}
            dataSource={list.map((row: ListEntry) => ({
              key: row.node.id,
              title: row.node.title,
              score: row.score,
              hours: row.hours,
            }))}
            pagination={{ pageSize: 50 }}
          />
        )}
      </Content>
    </>
  );
};

export default GameList;

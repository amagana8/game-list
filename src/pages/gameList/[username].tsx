import type { GetServerSideProps, NextPage } from 'next';
import { Layout, Table } from 'antd';
import { NavBar } from '@components/navBar';
import { GetPlayingList } from '../../graphQLQueries';
import { client } from '../../apollo-client';

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
interface ListProps {
  list: Array<ListEntry>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query;
  const { loading, error, data } = await client.query({
    query: GetPlayingList,
    variables: {
      where: {
        username: username,
      },
    },
  });

  return {
    props: {
      list: data.users[0].gamesPlayingConnection.edges,
    },
  };
};

const GameList: NextPage<ListProps> = ({ list }: ListProps) => {
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
      </Content>
    </>
  );
};

export default GameList;

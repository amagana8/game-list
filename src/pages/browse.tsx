import type { GetServerSideProps, NextPage } from 'next';
import { Layout, Table } from 'antd';
import { NavBar } from '@components/navBar';
import { client } from 'src/apollo-client';
import { GetGames } from 'src/graphQLQueries';
import Link from 'next/link';

const { Content } = Layout;

interface Game {
  id: number;
  title: string;
}

interface GameList {
  games: Array<Game>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await client.query({
    query: GetGames,
  });

  return {
    props: {
      games:  data.games,
    },
  };
};

const Browse: NextPage<GameList> = ({ games }) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text: string) => (<Link href={`/game/${text}`}><a>{text}</a></Link>)
    },
  ];
  return (
    <>
      <NavBar index="2" />
      <Content>
        <Table
          columns={columns}
          dataSource={games.map((row: Game) => ({
            key: row.id,
            title: row.title,
          }))}
        />
        </Content>
    </>
  );
};

export default Browse;

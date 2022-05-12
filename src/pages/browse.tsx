import type { NextPage } from 'next';
import { Layout, Table } from 'antd';
import { NavBar } from '@components/navBar';
import { GetGames } from 'src/graphQLQueries';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner';
import Head from 'next/head';

const { Content } = Layout;

interface Game {
  id: number;
  title: string;
}

const Browse: NextPage = () => {
  const { loading, data } = useQuery(GetGames);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text: string) => (
        <Link href={`/game/${text}`}>
          <a>{text}</a>
        </Link>
      ),
    },
  ];
  return (
    <>
      <Head>
        <title>Browse Games · GameList</title>
      </Head>
      <NavBar index="2" />
      <Content>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Table
            columns={columns}
            dataSource={data.games.map((row: Game) => ({
              key: row.id,
              title: row.title,
            }))}
          />
        )}
      </Content>
    </>
  );
};

export default Browse;

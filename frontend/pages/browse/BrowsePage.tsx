import type { NextPage } from 'next';
import { Layout, Table } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import { GetGames } from '@graphql/queries';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import Head from 'next/head';

const { Content } = Layout;

interface Game {
  id: number;
  title: string;
}

const BrowsePage: NextPage = () => {
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

export { BrowsePage };

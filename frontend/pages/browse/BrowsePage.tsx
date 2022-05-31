import type { NextPage } from 'next';
import { Layout, Typography } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import Head from 'next/head';
import { GameGrid } from '@components/gameGrid/GameGrid';
import { Game } from '@utils/types';
import { GameGridType } from '@utils/enums';
import { GetServerSideProps } from 'next';
import { GetGames } from '@graphql/queries';
import { client } from '@frontend/apollo-client';

const { Content } = Layout;
const { Title } = Typography;

interface BrowsePageProps {
  games: Game[];
}

const getServerSideProps: GetServerSideProps = async () => {
  const date = new Date().toISOString();

  const { data } = await client.query({
    query: GetGames,
    variables: {
      options: {
        limit: 50,
        sort: [{ releaseDate: 'DESC' }],
      },
      where: {
        releaseDate_LTE: date,
        cover_NOT: ''
      },
    },
  });

  return {
    props: {
      games: data.games,
    },
  };
};

const BrowsePage: NextPage<BrowsePageProps> = ({ games }: BrowsePageProps) => {
  return (
    <>
      <Head>
        <title>Browse Games · GameList</title>
      </Head>
      <NavBar index="2" />
      <Content>
        <Title>Browse</Title>
        <GameGrid games={games} type={GameGridType.Browse} />
      </Content>
    </>
  );
};

export { getServerSideProps, BrowsePage };

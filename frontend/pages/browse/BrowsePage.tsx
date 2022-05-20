import type { NextPage } from 'next';
import { Layout, Typography } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import { GetGames } from '@graphql/queries';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import Head from 'next/head';
import { GameGrid } from '@components/gameGrid/GameGrid';

const { Content } = Layout;
const { Title } = Typography;

const BrowsePage: NextPage = () => {
  const { loading, data } = useQuery(GetGames);

  return (
    <>
      <Head>
        <title>Browse Games · GameList</title>
      </Head>
      <NavBar index="2" />
      <Content>
        <Title>Browse</Title>
        {loading ? <LoadingSpinner /> : <GameGrid games={data.games} />}
      </Content>
    </>
  );
};

export { BrowsePage };

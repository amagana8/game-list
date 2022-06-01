import { NavBar } from '@components/navBar/NavBar';
import { Layout, Typography } from 'antd';
import Head from 'next/head';
import { Game } from '@utils/types';
import { useEffect } from 'react';
import { useAppDispatch } from '@utils/hooks';
import { setSearchLoading } from '@slices/searchSlice';
import { GameGrid } from '@components/gameGrid/GameGrid';
import { GameGridType } from '@utils/enums';
import { client } from '@frontend/apollo-client';
import { SearchGames } from '@graphql/queries';
import { GetServerSideProps } from 'next';

const { Content } = Layout;
const { Title } = Typography;

interface GameSearchPageProps {
  games: Game[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { search } = query;
  const { data } = await client.query({
    query: SearchGames,
    variables: {
      fulltext: {
        GameTitle: {
          phrase: search,
        },
      },
      options: {
        limit: 50,
      },
    },
  });

  return {
    props: {
      games: data.games,
    },
  };
};

const GameSearchPage = ({ games }: GameSearchPageProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSearchLoading(false));
  }, [games, dispatch]);

  return (
    <>
      <Head>
        <title>Search Games · GameList</title>
      </Head>
      <NavBar index="" />
      <Content>
        <Title>Games</Title>
        <GameGrid games={games} type={GameGridType.Search} />
      </Content>
    </>
  );
};

export { getServerSideProps, GameSearchPage };

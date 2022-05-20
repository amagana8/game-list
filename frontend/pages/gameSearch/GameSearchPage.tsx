import { NavBar } from '@components/navBar/NavBar';
import { Layout, Typography } from 'antd';
import Head from 'next/head';
import { Game } from '@utils/types';
import { useEffect } from 'react';
import { useAppDispatch } from '@utils/hooks';
import { setSearchLoading } from '@slices/searchSlice';
import { GameGrid } from '@components/gameGrid/GameGrid';

const { Content } = Layout;
const { Title } = Typography;

interface GameSearchPageProps {
  games: Game[];
}

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
        <GameGrid games={games} />
      </Content>
    </>
  );
};

export { GameSearchPage };

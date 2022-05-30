import type { NextPage } from 'next';
import { Layout, Typography } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import Head from 'next/head';
import { GameGrid } from '@components/gameGrid/GameGrid';
import { Game } from '@utils/types';
import { GameGridType } from '@utils/enums';

const { Content } = Layout;
const { Title } = Typography;

interface BrowsePageProps {
  games: Game[];
}

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

export { BrowsePage };

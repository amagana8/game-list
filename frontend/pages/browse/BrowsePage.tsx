import type { NextPage } from 'next';
import Head from 'next/head';
import { GameGrid } from '@components/gameGrid/GameGrid';
import { Game } from '@utils/types';
import { GameGridType } from '@utils/enums';
import { GetServerSideProps } from 'next';
import { GetTopGames } from '@graphql/queries';
import { initializeApollo } from '@frontend/apollo-client';
import Title from 'antd/lib/typography/Title';

interface BrowsePageProps {
  games: Game[];
}

const getServerSideProps: GetServerSideProps = async () => {
  const client = initializeApollo();

  const { data } = await client.query({ query: GetTopGames });

  return {
    props: {
      games: data.topGames,
    },
  };
};

const BrowsePage: NextPage<BrowsePageProps> = ({ games }: BrowsePageProps) => {
  return (
    <>
      <Head>
        <title>Browse Games · GameList</title>
      </Head>
      <Title>Browse</Title>
      <GameGrid games={games} type={GameGridType.Browse} />
    </>
  );
};

export { getServerSideProps, BrowsePage };

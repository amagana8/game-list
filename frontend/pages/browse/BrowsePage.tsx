import type { NextPage } from 'next';
import Head from 'next/head';
import { GameGrid } from '@components/gameGrid/GameGrid';
import { Game, Genre, Platform } from '@utils/types';
import { GameGridType } from '@utils/enums';
import { GetServerSideProps } from 'next';
import { GetGenres, GetPlatforms, GetTopGames } from '@graphql/queries';
import { initializeApollo } from '@frontend/apollo-client';
import Title from 'antd/lib/typography/Title';

interface BrowsePageProps {
  games: Game[];
  platforms: Platform[];
  genres: Genre[];
}

const getServerSideProps: GetServerSideProps = async () => {
  const client = initializeApollo();

  const { data: gameData } = await client.query({ query: GetTopGames });
  const { data: platformData } = await client.query({ query: GetPlatforms });
  const { data: genreData } = await client.query({ query: GetGenres });

  return {
    props: {
      games: gameData.topGames,
      platforms: platformData.platforms,
      genres: genreData.genres,
    },
  };
};

const BrowsePage: NextPage<BrowsePageProps> = ({
  games,
  platforms,
  genres,
}: BrowsePageProps) => {
  return (
    <>
      <Head>
        <title>Browse Games · GameList</title>
      </Head>
      <Title>Browse</Title>
      <GameGrid
        games={games}
        type={GameGridType.Browse}
        platforms={platforms}
        genres={genres}
      />
    </>
  );
};

export { getServerSideProps, BrowsePage };

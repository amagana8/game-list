import Head from 'next/head';
import { Game, Genre, Platform } from '@utils/types';
import { GameGrid } from '@components/gameGrid/GameGrid';
import { GameGridType } from '@utils/enums';
import { initializeApollo } from '@frontend/apollo-client';
import { GetGenres, GetPlatforms, SearchGames } from '@graphql/queries';
import { GetServerSideProps } from 'next';
import Title from 'antd/lib/typography/Title';

interface GameSearchPageProps {
  games: Game[];
  platforms: Platform[];
  genres: Genre[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
  const { search } = query;

  if (!search) {
    return { props: { games: [] } };
  }

  const { data: gameData } = await client.query({
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
  const { data: platformData } = await client.query({ query: GetPlatforms });
  const { data: genreData } = await client.query({ query: GetGenres });

  return {
    props: {
      games: gameData.games,
      platforms: platformData.platforms,
      genres: genreData.genres,
    },
  };
};

const GameSearchPage = ({ games, platforms, genres }: GameSearchPageProps) => {
  return (
    <>
      <Head>
        <title>Search Games · GameList</title>
      </Head>
      <Title>Games</Title>
      <GameGrid
        games={games}
        type={GameGridType.Search}
        platforms={platforms}
        genres={genres}
      />
    </>
  );
};

export { getServerSideProps, GameSearchPage };

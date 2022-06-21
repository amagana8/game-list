import { GameGrid } from '@components/gameGrid/GameGrid';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import { initializeApollo } from '@frontend/apollo-client';
import { GetFavoriteGames } from '@graphql/queries';
import { GameGridType } from '@utils/enums';
import { Game } from '@utils/types';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Error from 'next/error';

interface FavoritesPageProps {
  username?: string;
  favoriteGames?: Game[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
  const { username } = query;
  const { data } = await client.query({
    query: GetFavoriteGames,
    variables: {
      where: {
        username,
      },
    },
  });

  if (!data.users.length) {
    return {
      props: {},
    };
  }

  return {
    props: {
      username,
      favoriteGames: data.users[0].favoriteGames,
    },
  };
};

const FavoritesPage: NextPage<FavoritesPageProps> = ({
  username,
  favoriteGames,
}: FavoritesPageProps) => {
  if (!username || !favoriteGames) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`${username}'s Favorite Games · GameList`}</title>
      </Head>
      <UserPageNavBar username={username} index="Favorites" />
      <GameGrid games={favoriteGames} type={GameGridType.Favorites} />
    </>
  );
};

export { getServerSideProps, FavoritesPage };

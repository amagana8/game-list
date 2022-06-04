import { GameGrid } from '@components/gameGrid/GameGrid';
import { NavBar } from '@components/navBar/NavBar';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import { client } from '@frontend/apollo-client';
import { GetFavoriteGames } from '@graphql/queries';
import { GameGridType } from '@utils/enums';
import { Game } from '@utils/types';
import { Content } from 'antd/lib/layout/layout';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

interface FavoritesPageProps {
  username: string;
  favoriteGames: Game[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query;
  const { data } = await client.query({
    query: GetFavoriteGames,
    variables: {
      where: {
        username,
      },
    },
  });

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
  return (
    <>
      <Head>
        <title>{`${username}'s Favorite Games · GameList`}</title>
      </Head>
      <NavBar />
      <Content>
        <UserPageNavBar username={username} index="3" />
        <GameGrid games={favoriteGames} type={GameGridType.Favorites} />
      </Content>
    </>
  );
};

export { getServerSideProps, FavoritesPage };

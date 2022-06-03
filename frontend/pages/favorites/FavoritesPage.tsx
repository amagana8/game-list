import { useQuery } from '@apollo/client';
import { GameGrid } from '@components/gameGrid/GameGrid';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { NavBar } from '@components/navBar/NavBar';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import { GetFavoriteGames } from '@graphql/queries';
import { GameGridType } from '@utils/enums';
import { Content } from 'antd/lib/layout/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';

const FavoritesPage = () => {
  const { username } = useRouter().query;
  const { loading, data } = useQuery(GetFavoriteGames, {
    variables: {
      where: {
        username,
      },
    },
  });

  return (
    <>
      <Head>
        <title>{`${username}'s Favorite Games · GameList`}</title>
      </Head>
      <NavBar />
      <Content>
        <UserPageNavBar username={username} index="3" />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <GameGrid
            games={data.users[0].favoriteGames}
            type={GameGridType.Favorites}
          />
        )}
      </Content>
    </>
  );
};

export { FavoritesPage };

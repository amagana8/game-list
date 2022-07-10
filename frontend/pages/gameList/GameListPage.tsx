import type { GetServerSideProps, NextPage } from 'next';
import { Anchor, Space } from 'antd';
import { GameTable } from '@components/gameTable/GameTable';
import styles from './GameListPage.module.scss';
import { Status } from '@utils/enums';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import Head from 'next/head';
import { GetGenres, GetList, GetPlatforms } from '@graphql/queries';
import { useCallback, useEffect, useState } from 'react';
import { initializeApollo } from '@frontend/apollo-client';
import Error from 'next/error';
import { Genre, ListEntry, Platform } from '@utils/types';
import { GameFilters } from '@components/gameFilters/GameFilters';
import { useAuthStore } from '@frontend/authStore';

const { Link } = Anchor;

interface GameListPageProps {
  gameList?: any;
  username?: string;
  platforms: Platform[];
  genres: Genre[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();

  const { username } = query;
  const { data: userData } = await client.query({
    query: GetList,
    variables: {
      where: {
        username,
      },
    },
  });

  const { data: platformData } = await client.query({ query: GetPlatforms });
  const { data: genreData } = await client.query({ query: GetGenres });

  if (!userData.users.length) {
    return {
      props: {},
    };
  }

  return {
    props: {
      username,
      gameList: userData.users[0].gameListConnection,
      platforms: platformData.platforms,
      genres: genreData.genres,
    },
  };
};

const GameListPage: NextPage<GameListPageProps> = ({
  username,
  gameList,
  platforms,
  genres,
}: GameListPageProps) => {
  const currentUser = useAuthStore((state) => state.username);
  const [ref, setRef] = useState<any>();
  const currentRef = useCallback((node: any) => {
    if (node !== null) {
      setRef(node.current);
    }
  }, []);

  const [selectedPlatforms, setSelectedPlatforms] = useState<String[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<String[]>([]);

  const [list, setList] = useState(gameList.edges);

  useEffect(() => {
    // filter by platforms
    let games = selectedPlatforms.length
      ? gameList.edges.filter((entry: ListEntry) =>
          entry.node.platforms.some((platform) =>
            selectedPlatforms.includes(platform.name),
          ),
        )
      : gameList.edges;

    // filter by genres
    if (selectedGenres.length) {
      games = games.filter((entry: ListEntry) =>
        entry.node.genres.some((genre) => selectedGenres.includes(genre.name)),
      );
    }

    setList(games);
  }, [selectedPlatforms, selectedGenres, gameList.edges]);

  if (!username) {
    return <Error statusCode={404} />;
  }

  const getStatusList = (status: Status) => {
    return list.filter((entry: ListEntry) => entry.status === status);
  };

  return (
    <>
      <Head>
        <title>{`${username}'s List · GameList`}</title>
      </Head>
      <div className={styles.anchor}>
        <Space direction="vertical">
          <Anchor getContainer={ref} showInkInFixed={true}>
            <Link href="#playing" title="Playing" />
            <Link href="#completed" title="Completed" />
            <Link href="#paused" title="Paused" />
            <Link href="#dropped" title="Dropped" />
            <Link href="#planning" title="Planning" />
          </Anchor>

          <GameFilters
            platforms={platforms}
            genres={genres}
            setPlatforms={setSelectedPlatforms}
            setGenres={setSelectedGenres}
          />
        </Space>
      </div>
      <UserPageNavBar username={username} index="Game List" />
      <div ref={currentRef} className={styles.list}>
        <GameTable
          status={Status.Playing}
          data={getStatusList(Status.Playing)}
          editable={username === currentUser}
        />
        <GameTable
          status={Status.Completed}
          data={getStatusList(Status.Completed)}
          editable={username === currentUser}
        />
        <GameTable
          status={Status.Paused}
          data={getStatusList(Status.Paused)}
          editable={username === currentUser}
        />
        <GameTable
          status={Status.Dropped}
          data={getStatusList(Status.Dropped)}
          editable={username === currentUser}
        />
        <GameTable
          status={Status.Planning}
          data={getStatusList(Status.Planning)}
          editable={username === currentUser}
        />
      </div>
    </>
  );
};

export { getServerSideProps, GameListPage };

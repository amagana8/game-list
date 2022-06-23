import type { GetServerSideProps, NextPage } from 'next';
import { Anchor } from 'antd';
import { GameTable } from '@components/gameTable/GameTable';
import styles from './GameListPage.module.scss';
import { Status } from '@utils/enums';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import Head from 'next/head';
import { GetList } from '@graphql/queries';
import { useCallback, useState } from 'react';
import { initializeApollo } from '@frontend/apollo-client';
import Error from 'next/error';

const { Link } = Anchor;

interface GameListPageProps {
  gameList?: any;
  username?: string;
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();

  const { username } = query;
  const { data } = await client.query({
    query: GetList,
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
      gameList: data.users[0],
    },
  };
};

const GameListPage: NextPage<GameListPageProps> = ({
  username,
  gameList,
}: GameListPageProps) => {
  const [ref, setRef] = useState<any>();
  const currentRef = useCallback((node: any) => {
    if (node !== null) {
      setRef(node.current);
    }
  }, []);

  if (!username) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`${username}'s List · GameList`}</title>
      </Head>
      <Anchor
        className={styles.anchor}
        getContainer={ref}
        showInkInFixed={true}
      >
        <Link href="#playing" title="Playing" />
        <Link href="#completed" title="Completed" />
        <Link href="#paused" title="Paused" />
        <Link href="#dropped" title="Dropped" />
        <Link href="#planning" title="Planning" />
      </Anchor>

      <UserPageNavBar username={username} index="Game List" />
      <div ref={currentRef}>
        <GameTable status={Status.Playing} data={gameList.Playing.edges} />
        <GameTable status={Status.Completed} data={gameList.Completed.edges} />
        <GameTable status={Status.Paused} data={gameList.Paused.edges} />
        <GameTable status={Status.Dropped} data={gameList.Dropped.edges} />
        <GameTable status={Status.Planning} data={gameList.Planning.edges} />
      </div>
    </>
  );
};

export { getServerSideProps, GameListPage };

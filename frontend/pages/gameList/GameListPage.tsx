import type { GetServerSideProps, NextPage } from 'next';
import { Anchor, Layout } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import { GameTable } from '@components/gameTable/GameTable';
import styles from './GameListPage.module.scss';
import { Status } from '@utils/enums';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import Head from 'next/head';
import { GetList } from '@graphql/queries';
import { useRef } from 'react';
import { initializeApollo } from '@frontend/apollo-client';

const { Content } = Layout;
const { Link } = Anchor;

interface GameListPageProps {
  gameList: any;
  username: string;
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
  const gameListRef = useRef<any>(null);
  return (
    <>
      <Head>
        <title>{`${username}'s List · GameList`}</title>
      </Head>
      <NavBar index="3" />
      <Anchor
        className={styles.anchor}
        getContainer={gameListRef.current}
        showInkInFixed={true}
      >
        <Link href="#playing" title="Playing" />
        <Link href="#completed" title="Completed" />
        <Link href="#paused" title="Paused" />
        <Link href="#dropped" title="Dropped" />
        <Link href="#planning" title="Planning" />
      </Anchor>

      <Content>
        <UserPageNavBar username={username} index="2" />
        <div ref={gameListRef}>
          <GameTable status={Status.Playing} data={gameList.Playing.edges} />
          <GameTable
            status={Status.Completed}
            data={gameList.Completed.edges}
          />
          <GameTable status={Status.Paused} data={gameList.Paused.edges} />
          <GameTable status={Status.Dropped} data={gameList.Dropped.edges} />
          <GameTable status={Status.Planning} data={gameList.Planning.edges} />
        </div>
      </Content>
    </>
  );
};

export { getServerSideProps, GameListPage };

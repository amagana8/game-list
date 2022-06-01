import type { NextPage } from 'next';
import { Anchor, Layout } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import { GameTable } from '@components/gameTable/GameTable';
import styles from './GameListPage.module.scss';
import { Status } from '@utils/enums';
import { useRouter } from 'next/router';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import Head from 'next/head';
import { GetList } from '@graphql/queries';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { useRef } from 'react';

const { Content } = Layout;
const { Link } = Anchor;

const GameListPage: NextPage = () => {
  const { username } = useRouter().query;
  const { loading, data } = useQuery(GetList, {
    variables: {
      where: {
        username,
      },
    },
  });
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
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div ref={gameListRef}>
            <GameTable
              status={Status.Playing}
              data={data.users[0].Playing.edges}
            />
            <GameTable
              status={Status.Completed}
              data={data.users[0].Completed.edges}
            />
            <GameTable
              status={Status.Paused}
              data={data.users[0].Paused.edges}
            />
            <GameTable
              status={Status.Dropped}
              data={data.users[0].Dropped.edges}
            />
            <GameTable
              status={Status.Planning}
              data={data.users[0].Planning.edges}
            />
          </div>
        )}
      </Content>
    </>
  );
};

export { GameListPage };

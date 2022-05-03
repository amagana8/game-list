import type { GetServerSideProps, NextPage } from 'next';
import { client } from '../../apollo-client';
import { GetGame, GetGameStatus } from '../../graphQLQueries';
import { Typography, Layout, Button } from 'antd';
import { NavBar } from '@components/navBar';
import { AddGameModal } from '@components/addGameModal';
import React, { useEffect, useState } from 'react';
import styles from '@styles/title.module.scss';
import { UserStatusBar } from '@components/userStatusBar';
import { useQuery } from '@apollo/client';
import { useAppSelector } from 'src/hooks';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Game {
  id: string;
  title: string;
  publishers: string[];
  developers: string[];
  summary: string;
  genre: string;
  usersTotal: UserListAggregate;
  usersPlaying: statusCount;
  usersCompleted: statusCount;
  usersPaused: statusCount;
  usersDropped: statusCount;
  usersPlanning: statusCount;
}

interface UserListAggregate {
  count: number;
}

interface statusCount {
  totalCount: number;
}
interface GameProps {
  game: Game;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { title } = query;
  const { data } = await client.query({
    query: GetGame,
    variables: {
      where: {
        title: title,
      },
    },
  });

  return {
    props: {
      game: data.games[0],
    },
  };
};

const GamePage: NextPage<GameProps> = ({ game }) => {
  const [showModal, setShowModal] = useState(false);

  const username = useAppSelector((state) => state.user.username);

  const { loading, data } = useQuery(GetGameStatus, {
    variables: {
      where: {
        username,
      },
      gameListConnectionWhere2: {
        node: {
          id: game.id,
        },
      },
    },
  });

  const gameConnection = data?.users[0].gameListConnection.edges[0];

  return (
    <>
      <NavBar />
      <Content>
        <Title className={styles.gameTitle}>{game.title}</Title>
        <Button
          type="primary"
          className={styles.listButton}
          onClick={() => setShowModal(true)}
        >
          {!loading && gameConnection ? 'Edit List Entry' : 'Add to List'}
        </Button>
        <AddGameModal
          showModal={showModal}
          setShowModal={setShowModal}
          gameTitle={game.title}
          initialValues={
            gameConnection && {
              status: gameConnection.status,
              hours: gameConnection.hours,
              score: gameConnection.score,
            }
          }
        />
        <ul className={styles.list}>
          <li>
            <Text strong>Developers: </Text>
            <Text>{game.developers.join(', ')}</Text>
          </li>
          <li>
            <Text strong>Publishers: </Text>
            <Text>{game.publishers.join(', ')}</Text>
          </li>
          <li>
            <Text strong>Genre: </Text>
            <Text>{game.genre}</Text>
          </li>
        </ul>
        <Paragraph>Summary: {game.summary}</Paragraph>
        <div>
          <UserStatusBar
            section="Playing"
            amount={game.usersPlaying.totalCount}
            total={game.usersTotal.count}
          />
          <UserStatusBar
            section="Completed"
            amount={game.usersCompleted.totalCount}
            total={game.usersTotal.count}
          />
          <UserStatusBar
            section="Paused"
            amount={game.usersPaused.totalCount}
            total={game.usersTotal.count}
          />
          <UserStatusBar
            section="Dropped"
            amount={game.usersDropped.totalCount}
            total={game.usersTotal.count}
          />
          <UserStatusBar
            section="Planning"
            amount={game.usersPlanning.totalCount}
            total={game.usersTotal.count}
          />
        </div>
      </Content>
    </>
  );
};

export default GamePage;

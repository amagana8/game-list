import type { GetServerSideProps, NextPage } from 'next';
import { client } from '../../apollo-client';
import { GetGame, GetGameStatus } from '../../graphQLQueries';
import { Typography, Layout, Button, Row, Col, Space } from 'antd';
import { NavBar } from '@components/navBar';
import { AddGameModal } from '@components/addGameModal';
import React, { useState } from 'react';
import styles from '@styles/title.module.scss';
import { useQuery } from '@apollo/client';
import { useAppSelector } from 'src/hooks';
import dynamic from 'next/dynamic';
import { scoreMap } from 'src/enums';

const DoughnutChart = dynamic(() => import('@components/doughnutChart'), {
  ssr: false,
});
const BarChart = dynamic(() => import('@components/barChart'), {
  ssr: false,
});

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Game {
  id: string;
  title: string;
  publishers: string[];
  developers: string[];
  summary: string;
  genre: string;
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

const GamePage: NextPage<GameProps> = ({ game }: GameProps) => {
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

  const gameConnection = data?.users[0]?.gameListConnection.edges[0];

  const statusData = Object.entries(game)
    .filter(([field]) => field.startsWith('users'))
    .map(([field, data]) => ({
      type: field.replace('users', ''),
      value: data.totalCount,
    }));

  const scoreData = Object.entries(game)
    .filter(([field]) => field.startsWith('score_'))
    .map(([field, data]) => ({
      score: scoreMap.get(field.replace('score_', '')),
      amount: data.totalCount,
    }));

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
        <Space direction="vertical" size="large">
        <Paragraph>Summary: {game.summary}</Paragraph>
        <Row>
          <Col span={6}>
            <Title>Status Distribution</Title>
            <DoughnutChart data={statusData} />
          </Col>
          <Col>
            <Title>Score Distribution</Title>
            <BarChart data={scoreData} />
          </Col>
        </Row>
        </Space>
      </Content>
    </>
  );
};

export default GamePage;

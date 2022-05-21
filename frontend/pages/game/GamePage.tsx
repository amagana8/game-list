import type { NextPage } from 'next';
import { GetGameStatus } from '@graphql/queries';
import {
  Typography,
  Layout,
  Button,
  Row,
  Col,
  Space,
  Progress,
  Image,
} from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import { AddGameModal } from '@components/addGameModal/AddGameModal';
import React, { useState } from 'react';
import styles from './GamePage.module.scss';
import { useQuery } from '@apollo/client';
import { useAppSelector } from '@utils/hooks';
import dynamic from 'next/dynamic';
import { colorMap, scoreMap } from '@utils/enums';
import Head from 'next/head';
import { parseDate, roundNumber } from '@utils/index';

const DoughnutChart = dynamic(
  () => import('@components/charts/doughnutChart/DoughnutChart'),
  {
    ssr: false,
  },
);
const BarChart = dynamic(() => import('@components/charts/barChart/BarChart'), {
  ssr: false,
});

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Game {
  id: string;
  title: string;
  cover: string;
  publishers: string[];
  developers: string[];
  summary: string;
  genre: string;
  releaseDate: string;
  userListAggregate: { edge: { score: { average: number } } };
}
interface GameProps {
  game: Game;
}

const GamePage: NextPage<GameProps> = ({ game }: GameProps) => {
  const [showModal, setShowModal] = useState(false);

  const username = useAppSelector((state) => state.user.username);

  const { loading, data } = useQuery(GetGameStatus, {
    variables: {
      where: {
        username,
      },
      gameListConnectionWhere: {
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

  const meanScore = game.userListAggregate.edge.score.average;

  return (
    <>
      <Head>
        <title>{game.title} · GameList</title>
      </Head>
      <NavBar />
      <Content>
        <Row justify="space-between">
          <Col>
            <Title className={styles.gameTitle}>{game.title}</Title>
          </Col>
          <Col>
            <Space>
              <div className={styles.meter}>
                <Row>
                  <Progress
                    type="circle"
                    strokeColor={colorMap.get(Math.round(meanScore))}
                    percent={roundNumber(meanScore) * 10}
                    format={(percent) => (percent ? percent / 10 : 'No Data')}
                  />
                </Row>
                <Row>
                  <p>Mean Score</p>
                </Row>
              </div>
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
            </Space>
          </Col>
        </Row>
        <Space>
          <Image
            src={game.cover}
            preview={false}
            width={264}
            alt={`${game.title} Cover`}
            fallback="https://i.imgur.com/fac0ifd.png"
            className={styles.cover}
          />
          <Paragraph className={styles.summary}>{game.summary}</Paragraph>
        </Space>
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
            <Text className={styles.genre}>{game.genre}</Text>
          </li>
          <li>
            <Text strong>Release Date: </Text>
            <Text>{parseDate(game.releaseDate)}</Text>
          </li>
        </ul>
        <Space direction="vertical" size="large">
          <Row>
            <Col span={8}>
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

export { GamePage };
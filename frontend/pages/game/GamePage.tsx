import type { NextPage } from 'next';
import { GetGameStatus } from '@graphql/queries';
import {
  Typography,
  Button,
  Row,
  Col,
  Space,
  Progress,
  Image,
  message,
} from 'antd';
import { AddGameModal } from '@components/addGameModal/AddGameModal';
import React, { useState } from 'react';
import styles from './GamePage.module.scss';
import { useMutation, useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import { colorMap } from '@utils/enums';
import Head from 'next/head';
import { parseDate, roundNumber } from '@utils/index';
import Link from 'next/link';
import { Game } from '@utils/types';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { ReviewGridType } from '@utils/enums';
import type { GetServerSideProps } from 'next';
import { initializeApollo } from '@frontend/apollo-client';
import { GetGame } from '@graphql/queries';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { AddFavoriteGame, RemoveFavoriteGame } from '@graphql/mutations';
import { useAuthStore } from '@frontend/authStore';

const DoughnutChart = dynamic(
  () => import('@components/charts/doughnutChart/DoughnutChart'),
  {
    ssr: false,
  },
);
const BarChart = dynamic(() => import('@components/charts/barChart/BarChart'), {
  ssr: false,
});

const { Title, Text, Paragraph } = Typography;

interface GameProps {
  game: Game;
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
  const { slug } = query;
  const { data } = await client.query({
    query: GetGame,
    variables: {
      where: {
        slug,
      },
      options: {
        limit: 10,
        sort: [{ createdAt: 'DESC' }],
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
  const [gameConnection, setGameConnection] = useState<any>();
  const [reviewed, setReviewed] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const username = useAuthStore(state => state.username);

  const { loading } = useQuery(GetGameStatus, {
    variables: {
      where: {
        username,
      },
      gameListConnectionWhere: {
        node: {
          id: game.id,
        },
      },
      gameReviewsWhere: {
        subject: {
          id: game.id,
        },
      },
      favoriteGamesWhere: {
        id: game.id,
      },
    },
    onCompleted: (data) => {
      setGameConnection(data.users[0].gameListConnection.edges[0]);
      setFavorited(data.users[0].favoriteGames.length);
      setReviewed(data.users[0].gameReviews.length);
    },
  });

  const statusData = Object.entries(game)
    .filter(([field]) => field.startsWith('users'))
    .map(([field, data]) => ({
      type: field.replace('users', ''),
      value: data.totalCount,
    }));

  const meanScore = game.userListAggregate.edge.score.average;

  const [addFavoriteGame] = useMutation(AddFavoriteGame);
  const favoriteGame = async () => {
    try {
      await addFavoriteGame({
        variables: {
          where: {
            username,
          },
          connect: {
            favoriteGames: [
              {
                where: {
                  node: {
                    id: game.id,
                  },
                },
              },
            ],
          },
        },
      });
      setFavorited(true);
      message.success('Added Game to Favorites!');
    } catch (error) {
      console.log(error);
    }
  };

  const [removeFavoriteGame] = useMutation(RemoveFavoriteGame);
  const unfavoriteGame = async () => {
    try {
      await removeFavoriteGame({
        variables: {
          where: {
            username,
          },
          disconnect: {
            favoriteGames: [
              {
                where: {
                  node: {
                    id: game.id,
                  },
                },
              },
            ],
          },
        },
      });
      setFavorited(false);
      message.success('Removed Game from Favorites!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>{game.title} · GameList</title>
      </Head>
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
            <Space direction="vertical" size="middle">
              <Button
                type="primary"
                className={styles.button}
                onClick={() => setShowModal(true)}
              >
                {!loading && gameConnection ? 'Edit List Entry' : 'Add to List'}
              </Button>
              {favorited ? (
                <Button
                  type="primary"
                  className={styles.favorite}
                  icon={<HeartFilled />}
                  onClick={() => unfavoriteGame()}
                >
                  Unfavorite
                </Button>
              ) : (
                <Button
                  type="primary"
                  className={styles.favorite}
                  icon={<HeartOutlined />}
                  onClick={() => favoriteGame()}
                >
                  Favorite
                </Button>
              )}
              {reviewed ? (
                <Link href={`/user/${username}/reviews/${game.slug}`}>
                  <a>
                    <Button className={styles.button}>See Your Review</Button>
                  </a>
                </Link>
              ) : (
                <Link href={`/game/${game.slug}/review`}>
                  <a>
                    <Button className={styles.button}>Submit Review</Button>
                  </a>
                </Link>
              )}
            </Space>
            <AddGameModal
              showModal={showModal}
              setShowModal={setShowModal}
              setGameConnection={setGameConnection}
              game={game}
              initialValues={gameConnection}
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
          <Text>
            {game.developers.map((developer) => developer.name).join(', ')}
          </Text>
        </li>
        <li>
          <Text strong>Publishers: </Text>
          <Text>
            {game.publishers.map((publisher) => publisher.name).join(', ')}
          </Text>
        </li>
        <li>
          <Text strong>Genre: </Text>
          <Text className={styles.genre}>
            {game.genres.map((genre) => genre.name).join(', ')}
          </Text>
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
          <Col span={8} offset={4}>
            <Title>Score Distribution</Title>
            <BarChart data={game.scoreDistribution} />
          </Col>
        </Row>
        <div>
          <Title>Reviews</Title>
          <ReviewGrid
            reviews={game.userReviews}
            type={ReviewGridType.Game}
            gameId={game.id}
          />
        </div>
      </Space>
    </>
  );
};

export { getServerSideProps, GamePage };

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
  List,
} from 'antd';
import { AddGameModal } from '@components/addGameModal/AddGameModal';
import React, { useState } from 'react';
import styles from './GamePage.module.scss';
import { useMutation, useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import { colorMap } from '@utils/enums';
import Head from 'next/head';
import { roundNumber } from '@utils/roundNumber';
import { parseDate } from '@utils/parseDate';
import Link from 'next/link';
import { Game, User } from '@utils/types';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { ReviewGridType } from '@utils/enums';
import type { GetServerSideProps } from 'next';
import { initializeApollo } from '@frontend/apollo-client';
import { GetGame } from '@graphql/queries';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { AddFavoriteGame, RemoveFavoriteGame } from '@graphql/mutations';
import { useAuthStore } from '@frontend/authStore';
import Error from 'next/error';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

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
  game?: Game;
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

  if (!data.games.length) {
    return {
      props: {},
    };
  }

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
  const username = useAuthStore((state) => state.username);
  const [addFavoriteGame] = useMutation(AddFavoriteGame);
  const [removeFavoriteGame] = useMutation(RemoveFavoriteGame);

  const { loading, data } = useQuery(GetGameStatus, {
    variables: {
      where: {
        username,
      },
      gameListConnectionWhere: {
        node: {
          id: game?.id,
        },
      },
      gameReviewsWhere: {
        subject: {
          id: game?.id,
        },
      },
      favoriteGamesWhere: {
        id: game?.id,
      },
      gameId: game?.id,
    },
    skip: !username || !game,
    onCompleted: (data) => {
      setGameConnection(data.users[0].gameListConnection.edges[0]);
      setFavorited(data.users[0].favoriteGames.length);
      setReviewed(data.users[0].gameReviews.length);
    },
  });

  if (!game) {
    return <Error statusCode={404} />;
  }

  const statusData = Object.entries(game)
    .filter(([field]) => field.startsWith('users'))
    .map(([field, data]) => ({
      type: field.replace('users', ''),
      value: data.totalCount,
    }));

  const meanScore = game.userListAggregate.edge.score.average;

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
          <Title>{game.title}</Title>
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
                loading={loading}
              >
                {gameConnection ? 'Edit List Entry' : 'Add to List'}
              </Button>
              <Button
                type="primary"
                className={styles.favorite}
                icon={favorited ? <HeartFilled /> : <HeartOutlined />}
                onClick={
                  favorited ? () => unfavoriteGame() : () => favoriteGame()
                }
                loading={loading}
              >
                {favorited ? 'Unfavorite' : 'Favorite'}
              </Button>
              <Link
                href={
                  reviewed
                    ? `/user/${username}/reviews/${game.slug}`
                    : `/game/${game.slug}/review`
                }
              >
                <a>
                  <Button className={styles.button} loading={loading}>
                    {reviewed ? 'See Your Review' : 'Submit Review'}
                  </Button>
                </a>
              </Link>
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
      <Row gutter={16} className={styles.gameInfo}>
        <Col span={6}>
          <Image
            src={game.cover}
            preview={false}
            width={264}
            alt={`${game.title} Cover`}
            fallback="https://i.imgur.com/fac0ifd.png"
          />
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
              <Text strong>Platforms: </Text>
              <Text className={styles.genre}>
                {game.platforms.map((platform) => platform.name).join(', ')}
              </Text>
            </li>
            <li>
              <Text strong>Genres: </Text>
              <Text className={styles.genre}>
                {game.genres.map((genre) => genre.name).join(', ')}
              </Text>
            </li>
            <li>
              <Text strong>Release Date: </Text>
              <Text>{parseDate(game.releaseDate)}</Text>
            </li>
          </ul>
        </Col>
        <Col span={12}>
          <Paragraph ellipsis={{ expandable: true, rows: 20 }}>
            {game.summary}
          </Paragraph>
        </Col>
      </Row>
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
      <Row justify="space-between" className={styles.offset}>
        <Col span={8}>
          <Title>Following</Title>
          {username ? (
            <>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <List
                  dataSource={data.users[0].followersPlaying}
                  renderItem={(user: User) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div>
                            <Link href={`/user/${user.username}`}>
                              <a>{user.username}</a>
                            </Link>
                          </div>
                        }
                      />
                      <Space size="large">
                        <div>
                          {`${user.gameListConnection.edges[0].status}`.toLowerCase()}
                        </div>
                        <div>{`${user.gameListConnection.edges[0].score}/10`}</div>
                      </Space>
                    </List.Item>
                  )}
                />
              )}
            </>
          ) : (
            <Text>Login to see if anyone you follow has played this game.</Text>
          )}
        </Col>
        <Col span={12}>
          <Title>Reviews</Title>
          <ReviewGrid
            reviews={game.userReviews}
            type={ReviewGridType.Game}
            gameId={game.id}
          />
        </Col>
      </Row>
    </>
  );
};

export { getServerSideProps, GamePage };

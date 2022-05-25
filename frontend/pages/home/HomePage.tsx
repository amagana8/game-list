import type { NextPage } from 'next';
import Head from 'next/head';
import { Col, Layout, List, Row, Typography } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import styles from './HomePage.module.scss';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { User } from '@utils/types';
import { ReviewGridType } from '@utils/enums';
import { GameGrid } from '@components/gameGrid/GameGrid';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import {
  GetSortedGames,
  GetSortedReviews,
  GetSortedUsers,
} from '@graphql/queries';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

const { Content } = Layout;
const { Title } = Typography;

const HomePage: NextPage = () => {
  const { loading: reviewLoading, data: reviewData } = useQuery(
    GetSortedReviews,
    {
      variables: {
        options: {
          sort: [
            {
              createdAt: 'DESC',
            },
          ],
        },
      },
    },
  );

  const { loading: gameLoading, data: gameData } = useQuery(GetSortedGames, {
    variables: {
      options: {
        sort: [
          {
            releaseDate: 'DESC',
          },
        ],
      },
    },
  });

  const { loading: userLoading, data: userData } = useQuery(GetSortedUsers, {
    variables: {
      options: {
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    },
  });
  console.log(gameData);
  return (
    <>
      <Head>
        <title>Home · GameList</title>
      </Head>
      <NavBar index="1" />
      <Content>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Title>Latest Users</Title>
            {userLoading ? (
              <LoadingSpinner />
            ) : (
              <List
                className={styles.users}
                dataSource={userData.users}
                renderItem={(user: User) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Link href={`/user/${user.username}`}>
                          <a>{user.username}</a>
                        </Link>
                      }
                      description={`Total Hours: ${user.gameListAggregate.edge.hours.sum}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Col>
          <Col span={8}>
            <Title>New Releases</Title>
            {gameLoading ? (
              <LoadingSpinner />
            ) : (
              <GameGrid games={gameData.games} home />
            )}
          </Col>
          <Col span={8}>
            <Title>Recent Reviews</Title>
            {reviewLoading ? (
              <LoadingSpinner />
            ) : (
              <ReviewGrid
                reviews={reviewData.reviews}
                type={ReviewGridType.Home}
              />
            )}
          </Col>
        </Row>
      </Content>
    </>
  );
};

export { HomePage };

import type { NextPage } from 'next';
import Head from 'next/head';
import { Col, Layout, List, Row, Typography } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import styles from './HomePage.module.scss';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { User } from '@utils/types';
import { GameGridType, ReviewGridType } from '@utils/enums';
import { GameGrid } from '@components/gameGrid/GameGrid';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GetHomeInfo } from '@graphql/queries';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

const { Content } = Layout;
const { Title } = Typography;

const HomePage: NextPage = () => {
  const { loading, data } = useQuery(GetHomeInfo, {
    variables: {
      userOptions: {
        limit: 20,
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
      gamesOptions: {
        limit: 20,
        sort: [
          {
            releaseDate: 'DESC',
          },
        ],
      },
      reviewsOptions: {
        limit: 20,
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    },
  });

  if (loading) return <LoadingSpinner />;

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

            <List
              className={styles.users}
              dataSource={data.users}
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
          </Col>
          <Col span={8}>
            <Title>New Releases</Title>

            <GameGrid games={data.games} type={GameGridType.Home} />
          </Col>
          <Col span={8}>
            <Title>Recent Reviews</Title>

            <ReviewGrid reviews={data.reviews} type={ReviewGridType.Home} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export { HomePage };

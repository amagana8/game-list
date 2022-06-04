import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Col, Layout, List, Row, Typography } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import styles from './HomePage.module.scss';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { Game, Review, User } from '@utils/types';
import { GameGridType, ReviewGridType } from '@utils/enums';
import { GameGrid } from '@components/gameGrid/GameGrid';
import Link from 'next/link';
import { GetHomeInfo } from '@graphql/queries';
import { initializeApollo } from '@frontend/apollo-client';

const { Content } = Layout;
const { Title } = Typography;

interface HomePageProps {
  users: User[];
  games: Game[];
  reviews: Review[];
}

const getServerSideProps: GetServerSideProps = async () => {
  const client = initializeApollo();
  const date = new Date();
  const { data } = await client.query({
    query: GetHomeInfo,
    variables: {
      userOptions: {
        limit: 20,
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
      gameWhere: {
        releaseDate_LTE: date.toISOString(),
        cover_NOT: '',
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

  return {
    props: {
      users: data.users,
      games: data.games,
      reviews: data.reviews,
    },
  };
};

const HomePage: NextPage<HomePageProps> = ({
  users,
  games,
  reviews,
}: HomePageProps) => {
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
              dataSource={users}
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
            <GameGrid games={games} type={GameGridType.Home} />
          </Col>
          <Col span={8}>
            <Title>Recent Reviews</Title>
            <ReviewGrid reviews={reviews} type={ReviewGridType.Home} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export { getServerSideProps, HomePage };

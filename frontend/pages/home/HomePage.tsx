import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Col, List, Row } from 'antd';
import styles from './HomePage.module.scss';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { User } from '@utils/types';
import { GameGridType, ReviewGridType } from '@utils/enums';
import { GameGrid } from '@components/gameGrid/GameGrid';
import Link from 'next/link';
import { GetHomeInfo } from '@graphql/queries';
import Title from 'antd/lib/typography/Title';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const HomePage: NextPage = () => {
  const { data, loading } = useQuery(GetHomeInfo, {
    variables: {
      userOptions: {
        limit: 10,
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
      gamesLimit: 10,
      reviewsOptions: {
        limit: 10,
        sort: [
          {
            createdAt: 'DESC',
          },
        ],
      },
    },
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        <title>Home · GameList</title>
        <meta
          name="description"
          content="Keep track of all the games you've played, share your list with
          friends, see stats on your playtime, and discover new games."
        />
      </Head>
      <Row gutter={16}>
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
          <Title>Highest Rated</Title>
          <GameGrid games={data.topGames} type={GameGridType.Home} />
        </Col>
        <Col span={8}>
          <Title>Recent Reviews</Title>
          <ReviewGrid reviews={data.reviews} type={ReviewGridType.Home} />
        </Col>
      </Row>
    </>
  );
};

export { getServerSideProps, HomePage };

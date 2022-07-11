import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Col, List, Row, Tabs } from 'antd';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { User, UserCount } from '@utils/types';
import { ReviewGridType } from '@utils/enums';
import Link from 'next/link';
import {
  GetFollowingActivity,
  GetGlobalActivity,
  GetHomeInfo,
} from '@graphql/queries';
import Title from 'antd/lib/typography/Title';
import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { useAuthStore } from '@frontend/authStore';
import { ActivityFeed } from '@components/activityFeed/ActivityFeed';

const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const HomePage: NextPage = () => {
  const username = useAuthStore((state) => state.username);
  const { data, loading } = useQuery(GetHomeInfo, {
    variables: {
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

  const { data: activityData, loading: activityLoading } = useQuery(
    GetFollowingActivity,
    { variables: { where: { username } }, skip: !username },
  );

  const { data: globalData, loading: globalLoading } =
    useQuery(GetGlobalActivity);

  if (loading || activityLoading || globalLoading) {
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
      <Row justify="space-evenly">
        <Col span={10}>
          <Title>Activity</Title>
          {username ? (
            <Tabs type="card">
              <Tabs.TabPane tab="Following" key="Following">
                <ActivityFeed
                  feedData={activityData.users[0].followingActivity}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Global" key="Global">
                <ActivityFeed feedData={globalData.globalActivity} />
              </Tabs.TabPane>
            </Tabs>
          ) : (
            <ActivityFeed feedData={globalData.globalActivity} />
          )}
        </Col>
        <Col span={8}>
        <Title>Biggest Gamers</Title>
          <List
            dataSource={data.usersWithMostGamesPlayed}
            renderItem={(row: UserCount) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Link href={`/user/${row.user}`}>
                      <a>{row.user}</a>
                    </Link>
                  }
                  description={`Games Played: ${row.amount}`}
                />
              </List.Item>
            )}
          />
          <Title>Recent Reviews</Title>
          <ReviewGrid reviews={data.reviews} type={ReviewGridType.Home} />
        </Col>
      </Row>
    </>
  );
};

export { getServerSideProps, HomePage };

import type { GetServerSideProps, NextPage } from 'next';
import { Col, Row, Statistic } from 'antd';
import { GetUserStats } from '@graphql/queries';
import styles from './ProfilePage.module.scss';
import dynamic from 'next/dynamic';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import Head from 'next/head';
import { parseDate, roundNumber } from '@utils/index';
import { initializeApollo } from '@frontend/apollo-client';
import Title from 'antd/lib/typography/Title';

const DoughnutChart = dynamic(
  () => import('@components/charts/doughnutChart/DoughnutChart'),
  {
    ssr: false,
  },
);
const BarChart = dynamic(() => import('@components/charts/barChart/BarChart'), {
  ssr: false,
});
const TreeMap = dynamic(() => import('@components/charts/treeMap/TreeMap'), {
  ssr: false,
});

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
  const { username } = query;
  const { data } = await client.query({
    query: GetUserStats,
    variables: {
      where: {
        username,
      },
    },
  });

  return {
    props: {
      username,
      userData: data.users[0],
    },
  };
};

const ProfilePage: NextPage = ({ username, userData }: any) => {
  const statusData = Object.keys(userData)
    .filter((field) => field.startsWith('games'))
    .map((field) => ({
      type: field.replace('games', ''),
      value: userData[field].totalCount,
    }));

  const hoursPlayed = userData.gameListAggregate.edge.hours.sum;
  const daysPlayed = roundNumber(hoursPlayed / 24);
  const yearsPlayed = roundNumber(daysPlayed / 365);

  return (
    <>
      <Head>
        <title>{`${username}'s Profile · GameList`}</title>
      </Head>
      <UserPageNavBar username={username} index="Profile" />
      <p className={styles.joinDate}>
        Joined GameList on {parseDate(userData.createdAt)}
      </p>
      <div className={styles.stats}>
        <div className={styles.summary}>
          <Title level={2}>Summary</Title>
          <Row gutter={16}>
            <Col>
              <Statistic
                title="Total Games"
                value={userData.gameListConnection.totalCount}
              />
            </Col>
            <Col>
              <Statistic
                title="Mean Score"
                value={roundNumber(
                  userData.gameListAggregate.edge.score.average,
                )}
              />
            </Col>
            <Col>
              <Statistic
                title="Mean Hours"
                value={roundNumber(
                  userData.gameListAggregate.edge.hours.average,
                )}
              />
            </Col>
          </Row>
        </div>
        <div>
          <Title level={2}>Hours Spent</Title>
          <Row gutter={16}>
            <Col>
              <Statistic title="Hours Played" value={hoursPlayed} />
            </Col>
            <Col>
              <Statistic title="Days Played" value={daysPlayed} />
            </Col>
            <Col>
              <Statistic title="Years Played" value={yearsPlayed} />
            </Col>
          </Row>
        </div>
      </div>
      <Row gutter={64}>
        <Col>
          <Title level={2}>Status Distribution</Title>
          <DoughnutChart data={statusData} />
        </Col>
        <Col>
          <Title level={2}>Score Distribution</Title>
          <BarChart data={userData.scoreDistribution} />
        </Col>
        <Col>
          <Title level={2}>Genre Distribution</Title>
          <TreeMap data={userData.genreDistribution} />
        </Col>
      </Row>
    </>
  );
};

export { getServerSideProps, ProfilePage };

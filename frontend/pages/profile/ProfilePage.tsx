import { NavBar } from '@components/navBar/NavBar';
import { Content } from 'antd/lib/layout/layout';
import type { NextPage } from 'next';
import { Col, Row, Statistic, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GetUserStats } from '@graphql/queries';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import styles from './ProfilePage.module.scss';
import dynamic from 'next/dynamic';
import { scoreMap } from '@utils/enums';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
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
const TreeMap = dynamic(() => import('@components/charts/treeMap/TreeMap'), {
  ssr: false,
});

const { Title } = Typography;

const ProfilePage: NextPage = () => {
  const { username } = useRouter().query;

  const { loading, data } = useQuery(GetUserStats, {
    variables: {
      where: {
        username,
      },
    },
  });

  if (loading)
    return (
      <>
        <NavBar index="" />
        <Content>
          <UserPageNavBar username={username} index="1" />
          <LoadingSpinner />
        </Content>
      </>
    );

  const userData = data.users[0];

  const statusData = Object.keys(userData)
    .filter((field) => field.startsWith('games'))
    .map((field) => ({
      type: field.replace('games', ''),
      value: userData[field].totalCount,
    }));

  const scoreData = Object.keys(userData)
    .filter((field) => field.startsWith('score_'))
    .map((field) => ({
      score: scoreMap.get(field.replace('score_', '')),
      amount: userData[field].totalCount,
    }));

  const genreData = Object.keys(userData)
    .filter((field) => field.startsWith('genre_'))
    .map((field) => ({
      name: field.replace('genre_', ''),
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
      <NavBar index="" />
      <Content>
        <UserPageNavBar username={username} index="1" />
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
            <BarChart data={scoreData} />
          </Col>
          <Col>
            <Title level={2}>Genre Distribution</Title>
            <TreeMap data={genreData} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export { ProfilePage };

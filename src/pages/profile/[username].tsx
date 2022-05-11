import { NavBar } from '@components/navBar';
import { Content } from 'antd/lib/layout/layout';
import type { NextPage } from 'next';
import { Col, Row, Statistic, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GetUserStats } from 'src/graphQLQueries';
import { LoadingSpinner } from '@components/loadingSpinner';
import styles from '@styles/profile.module.scss';
import dynamic from 'next/dynamic';
import { scoreMap } from 'src/enums';
import { UserNavBar } from '@components/userNavBar';

const DoughnutChart = dynamic(() => import('@components/doughnutChart'), {
  ssr: false,
});
const BarChart = dynamic(() => import('@components/barChart'), {
  ssr: false,
});
const TreeMap = dynamic(() => import('@components/treeMap'), {
  ssr: false,
});

const { Title } = Typography;

const roundNumber = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

const Profile: NextPage = () => {
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
          <UserNavBar username={username} index="1" />
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
      <NavBar index="" />
      <Content>
        <UserNavBar username={username} index="1" />
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

export default Profile;

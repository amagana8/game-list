import { NavBar } from '@components/navBar';
import { Content } from 'antd/lib/layout/layout';
import type { NextPage } from 'next';
import { Button, Col, Row, Statistic, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GetUserStats } from 'src/graphQLQueries';
import { LoadingSpinner } from '@components/loadingSpinner';
import Link from 'next/link';
import styles from '@styles/profile.module.scss';
import dynamic from 'next/dynamic';
import { scoreMap } from 'src/enums';

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

const Profile: NextPage = () => {
  const { username } = useRouter().query;

  const { loading, data } = useQuery(GetUserStats, {
    variables: {
      where: {
        username,
      },
    },
  });

  if (loading) return <LoadingSpinner />;

  const statusData = Object.keys(data.users[0])
    .filter((field) => field.startsWith('games'))
    .map((field) => ({
      type: field.replace('games', ''),
      value: data.users[0][field].totalCount,
    }));

  const scoreData = Object.keys(data.users[0])
    .filter((field) => field.startsWith('score_'))
    .map((field) => ({
      score: scoreMap.get(field.replace('score_', '')),
      amount: data.users[0][field].totalCount,
    }));

  const genreData = Object.keys(data.users[0])
    .filter((field) => field.startsWith('genre_'))
    .map((field) => ({
      name: field.replace('genre_', ''),
      value: data.users[0][field].totalCount,
    }));

  return (
    <>
      <NavBar index="" />
      <Content>
        <Title className={styles.title}>{username}</Title>
        <div className={styles.listButton}>
          <Button type="primary">
            <Link href={`/gameList/${username}`}>
              <a>Game List</a>
            </Link>
          </Button>
        </div>
        <div className={styles.summary}>
          <Title level={2}>Summary</Title>
          <Row gutter={16}>
            <Col>
              <Statistic
                title="Total Games"
                value={data.users[0].gameListConnection.totalCount}
              />
            </Col>
            <Col>
              <Statistic
                title="Hours Played"
                value={data.users[0].gameListAggregate.edge.hours.sum}
              />
            </Col>
            <Col>
              <Statistic
                title="Mean Score"
                value={
                  Math.round(
                    data.users[0].gameListAggregate.edge.score.average * 100,
                  ) / 100
                }
              />
            </Col>
          </Row>
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

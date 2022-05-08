import { NavBar } from '@components/navBar';
import { Content } from 'antd/lib/layout/layout';
import type { NextPage } from 'next';
import { Button, Col, Row, Typography } from 'antd';
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
  .filter(field => field.startsWith('game'))
  .map(field => ({
    type: field.replace('games', ''),
    value: data.users[0][field].totalCount,
  }));

  const scoreData = Object.keys(data.users[0])
  .filter(field => field.startsWith('score_'))
  .map(field => ({
    score: scoreMap.get(field.replace('score_', '')),
    amount: data.users[0][field].totalCount,
  }));

  return (
    <>
      <NavBar index="" />
      <Content>
        <Title>{username}</Title>
        <div className={styles.listButton}>
          <Button type="primary">
            <Link href={`/gameList/${username}`}>
              <a>Game List</a>
            </Link>
          </Button>
        </div>
        <Row>
          <Col span={6}>
            <Title>Status Distribution</Title>
            <DoughnutChart data={statusData} />
          </Col>
          <Col>
            <Title>Score Distribution</Title>
            <BarChart data={scoreData} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Profile;

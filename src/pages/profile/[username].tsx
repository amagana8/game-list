import { NavBar } from '@components/navBar';
import { Content } from 'antd/lib/layout/layout';
import type { NextPage } from 'next';
import { Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GetUserCounts } from 'src/graphQLQueries';
import { LoadingSpinner } from '@components/loadingSpinner';
import Link from 'next/link';
import styles from '@styles/profile.module.scss';
import dynamic from 'next/dynamic';

const DoughnutChart = dynamic(() => import('@components/doughnutChart'), {
  ssr: false,
});

const { Title } = Typography;

const Profile: NextPage = () => {
  const { username } = useRouter().query;

  const { loading, data } = useQuery(GetUserCounts, {
    variables: {
      where: {
        username,
      },
    },
  });

  if (loading) return <LoadingSpinner />;

  const chartData = [
    {
      type: 'Playing',
      value: data.users[0].gamesPlaying.totalCount,
    },
    {
      type: 'Completed',
      value: data.users[0].gamesCompleted.totalCount,
    },
    {
      type: 'Paused',
      value: data.users[0].gamesPaused.totalCount,
    },
    {
      type: 'Dropped',
      value: data.users[0].gamesDropped.totalCount,
    },
    {
      type: 'Planning',
      value: data.users[0].gamesPlanning.totalCount,
    },
  ];

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
        <DoughnutChart data={chartData} />
      </Content>
    </>
  );
};

export default Profile;

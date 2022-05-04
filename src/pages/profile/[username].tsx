import { NavBar } from '@components/navBar';
import { Content } from 'antd/lib/layout/layout';
import type { NextPage } from 'next';
import { Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GetUserCounts } from 'src/graphQLQueries';
import { StatusCountBar } from '@components/statusCountBar';
import { LoadingSpinner } from '@components/loadingSpinner';
import Link from 'next/link';
import styles from '@styles/profile.module.scss';

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
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <StatusCountBar
              section="Playing"
              amount={data.users[0].gamesPlaying.totalCount}
              total={data.users[0].gamesTotal.count}
            />
            <StatusCountBar
              section="Completed"
              amount={data.users[0].gamesCompleted.totalCount}
              total={data.users[0].gamesTotal.count}
            />
            <StatusCountBar
              section="Paused"
              amount={data.users[0].gamesPaused.totalCount}
              total={data.users[0].gamesTotal.count}
            />
            <StatusCountBar
              section="Dropped"
              amount={data.users[0].gamesDropped.totalCount}
              total={data.users[0].gamesTotal.count}
            />
            <StatusCountBar
              section="Planning"
              amount={data.users[0].gamesPlanning.totalCount}
              total={data.users[0].gamesTotal.count}
            />
          </>
        )}
      </Content>
    </>
  );
};

export default Profile;

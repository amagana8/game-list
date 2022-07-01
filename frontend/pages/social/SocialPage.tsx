import Head from 'next/head';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import { GetServerSideProps, NextPage } from 'next';
import { initializeApollo } from '@frontend/apollo-client';
import { GetFollowers, GetFollowing } from '@graphql/queries';
import { User } from '@utils/types';
import { List, Tabs } from 'antd';
import Link from 'next/link';
import styles from './SocialPage.module.scss';

interface SocialPageProps {
  username: string;
  following: User[];
  followers: User[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
  const { username } = query;
  const { data: followingData } = await client.query({
    query: GetFollowing,
    variables: {
      where: {
        username,
      },
    },
  });

  const { data: followerData } = await client.query({
    query: GetFollowers,
    variables: {
      where: {
        username,
      },
    },
  });

  return {
    props: {
      username,
      following: followingData.users[0].following,
      followers: followerData.users[0].followers,
    },
  };
};

const SocialPage: NextPage<SocialPageProps> = ({
  username,
  following,
  followers,
}: SocialPageProps) => {
  return (
    <>
      <Head>
        <title>{`${username}'s Following · GameList`}</title>
      </Head>
      <UserPageNavBar username={username} index="Social" />
      <Tabs type="card" className={styles.tabs}>
        <Tabs.TabPane tab="Following" key="following">
          <List
            dataSource={following.map((row: User) => row.username)}
            renderItem={(username: string) => (
              <List.Item>
                <Link href={`/user/${username}`}>
                  <a>{username}</a>
                </Link>
              </List.Item>
            )}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Followers" key="followers">
          <List
            dataSource={followers.map((row: User) => row.username)}
            renderItem={(username: string) => (
              <List.Item>
                <Link href={`/user/${username}`}>
                  <a>{username}</a>
                </Link>
              </List.Item>
            )}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export { getServerSideProps, SocialPage };

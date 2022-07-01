import Head from 'next/head';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import { GetServerSideProps, NextPage } from 'next';
import { initializeApollo } from '@frontend/apollo-client';
import { GetFollowers, GetFollowing } from '@graphql/queries';
import { User } from '@utils/types';
import { Tabs } from 'antd';
import styles from './SocialPage.module.scss';
import { UserList } from '@components/userList/UserList';

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
          <UserList users={following} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Followers" key="followers">
          <UserList users={followers} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export { getServerSideProps, SocialPage };

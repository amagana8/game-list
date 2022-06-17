import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import { initializeApollo } from '@frontend/apollo-client';
import { GetUserReviews } from '@graphql/queries';
import { ReviewGridType } from '@utils/enums';
import { Review } from '@utils/types';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

interface UserReviewsPageProps {
  username: string;
  reviews: Review[];
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
  const { username } = query;
  const { data } = await client.query({
    query: GetUserReviews,
    variables: {
      where: {
        username,
      },
    },
  });

  return {
    props: {
      username,
      reviews: data.users[0].gameReviews,
    },
  };
};

const UserReviewsPage: NextPage<UserReviewsPageProps> = ({
  username,
  reviews,
}: UserReviewsPageProps) => {
  return (
    <>
      <Head>
        <title>{`${username}'s Reviews · GameList`}</title>
      </Head>
      <UserPageNavBar username={username} index="Reviews" />
      <ReviewGrid reviews={reviews} type={ReviewGridType.User} />
    </>
  );
};

export { getServerSideProps, UserReviewsPage };

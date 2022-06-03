import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { NavBar } from '@components/navBar/NavBar';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { UserPageNavBar } from '@components/userPageNavBar/UserPageNavBar';
import { GetUserReviews } from '@graphql/queries';
import { ReviewGridType } from '@utils/enums';
import { Content } from 'antd/lib/layout/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';

const UserReviewsPage = () => {
  const { username } = useRouter().query;
  const { loading, data } = useQuery(GetUserReviews, {
    variables: {
      where: {
        username,
      },
    },
  });

  return (
    <>
      <Head>
        <title>{`${username}'s Reviews · GameList`}</title>
      </Head>
      <NavBar />
      <Content>
        <UserPageNavBar username={username} index="4" />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ReviewGrid
            reviews={data.users[0].gameReviews}
            type={ReviewGridType.User}
          />
        )}
      </Content>
    </>
  );
};

export { UserReviewsPage };

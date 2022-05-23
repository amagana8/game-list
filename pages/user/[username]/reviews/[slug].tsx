import { client } from '@frontend/apollo-client';
import { GetReview } from '@graphql/queries';
import { ReviewPage } from '@pages/review/ReviewPage';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username, slug } = query;
  const { data } = await client.query({
    query: GetReview,
    variables: {
      where: {
        author: {
          username,
        },
        subject: {
          slug,
        },
      },
    },
  });

  return {
    props: {
      review: data.reviews[0],
    },
  };
};

export default ReviewPage;

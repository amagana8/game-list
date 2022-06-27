import { useMutation } from '@apollo/client';
import { useAuthStore } from '@frontend/authStore';
import { NewReview } from '@graphql/mutations';
import { Button, Form, Input } from 'antd';
import Title from 'antd/lib/typography/Title';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import styles from './AddReviewPage.module.scss';

interface ReviewForm {
  summary: string;
  body: string;
}

const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const AddReviewPage: NextPage = () => {
  const { slug } = useRouter().query;
  const username = useAuthStore((state) => state.username);
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const [newReview] = useMutation(NewReview);

  const onFinish = async (input: ReviewForm) => {
    try {
      await newReview({
        variables: {
          input: [
            {
              body: input.body,
              summary: input.summary,
              author: {
                connect: {
                  where: {
                    node: {
                      username: username,
                    },
                  },
                },
              },
              subject: {
                connect: {
                  where: {
                    node: {
                      slug,
                    },
                  },
                },
              },
            },
          ],
        },
      });
      Router.push(`/user/${username}/reviews/${slug}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Head>
        <title>Submit Review · GameList</title>
      </Head>
      <Title className={styles.title}>Submit a review</Title>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item label="Review Summary" name="summary">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Review" name="body">
          <Input.TextArea rows={25} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit">
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export { getServerSideProps, AddReviewPage };

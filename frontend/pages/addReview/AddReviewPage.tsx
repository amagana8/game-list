import { useMutation } from '@apollo/client';
import { NavBar } from '@components/navBar/NavBar';
import { NewReview } from '@graphql/mutations';
import { useAppSelector } from '@utils/hooks';
import { Button, Form, Input } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import styles from './AddReviewPage.module.scss';

interface ReviewForm {
  summary: string;
  body: string;
}

const AddReviewPage = () => {
  const { title } = useRouter().query;
  const username = useAppSelector((state) => state.user.username);
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
                      title: title,
                    },
                  },
                },
              },
            },
          ],
        },
      });
      Router.push(`/user/${username}/reviews/${title}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Head>
        <title>Submit Review · GameList</title>
      </Head>
      <NavBar index="" />
      <Content>
        <Title className={styles.title}>Submit a review for {title}</Title>
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
      </Content>
    </>
  );
};

export { AddReviewPage };
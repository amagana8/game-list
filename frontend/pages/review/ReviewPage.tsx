import { Button, Input, Typography, Space, Popconfirm, message } from 'antd';
import Head from 'next/head';
import { parseDate } from '@utils/index';
import { Review } from '@utils/types';
import { useEffect, useState } from 'react';
import styles from './ReviewPage.module.scss';
import { useMutation } from '@apollo/client';
import { DeleteReview, UpdateReview } from '@graphql/mutations';
import Router from 'next/router';
import { initializeApollo } from '@frontend/apollo-client';
import { GetReview } from '@graphql/queries';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useAuthStore } from '@frontend/authStore';
import Error from 'next/error';

const { Title, Paragraph } = Typography;

interface ReviewPageProps {
  review?: Review;
}

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const client = initializeApollo();
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

  if (!data.reviews.length) {
    return {
      props: {},
    };
  }

  return {
    props: {
      review: data.reviews[0],
    },
  };
};

const ReviewPage = ({ review }: ReviewPageProps) => {
  const username = useAuthStore((state) => state.username);
  const [showEditButton, setShowEditButton] = useState(false);
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(review?.summary);
  const [reviewBody, setReviewBody] = useState(review?.body);

  useEffect(() => {
    if (username === review?.author.username) {
      setShowEditButton(true);
    }
  }, [username, review]);

  const [updateReview] = useMutation(UpdateReview);
  const [deleteReview] = useMutation(DeleteReview);

  if (!review) {
    return <Error statusCode={404} />;
  }

  const submitReview = async () => {
    try {
      await updateReview({
        variables: {
          update: {
            body: reviewBody,
            summary: summary,
          },
          where: {
            id: review.id,
          },
        },
      });
      Router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const onConfirm = async () => {
    try {
      await deleteReview({
        variables: {
          where: {
            id: review.id,
          },
        },
      });
      Router.push(`/game/${review.subject.slug}`);
    } catch (error) {
      message.error('Failed to delete review.');
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>{`${review.author.username}'s Review of ${review.subject.title} · GameList`}</title>
      </Head>
      <Title className={styles.titleLink}>
        <Link href={`/game/${review.subject.slug}`}>
          <a>{review.subject.title}</a>
        </Link>
      </Title>
      {showEditButton && !editing && (
        <Button
          type="primary"
          className={styles.editButton}
          onClick={() => setEditing(true)}
        >
          Edit Review
        </Button>
      )}
      {showEditButton && editing && (
        <Button className={styles.editButton} onClick={() => setEditing(false)}>
          Cancel Edit
        </Button>
      )}
      {editing ? (
        <Input.TextArea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          autoSize={true}
        />
      ) : (
        <Title type="secondary" level={2}>
          {review.summary}
        </Title>
      )}
      <Title level={5} className={styles.titleLink}>
        By{' '}
        <Link href={`/user/${review.author.username}`}>
          <a>{review.author.username}</a>
        </Link>
      </Title>
      <Title type="secondary" level={5}>
        Posted: {parseDate(review.createdAt)}
      </Title>
      {review.updatedAt && (
        <Title type="secondary" level={5} className={styles.editedDate}>
          Last edited: {parseDate(review.updatedAt)}
        </Title>
      )}
      {editing ? (
        <Input.TextArea
          value={reviewBody}
          onChange={(e) => setReviewBody(e.target.value)}
          autoSize={true}
        />
      ) : (
        <Paragraph>{review.body}</Paragraph>
      )}
      {editing && (
        <Space className={styles.mutationButtons} size="large">
          <Button type="primary" onClick={() => submitReview()}>
            Update Review
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this review?"
            okText="Delete"
            okType="danger"
            onConfirm={onConfirm}
          >
            <Button danger={true} type="primary">
              Delete Review
            </Button>
          </Popconfirm>
        </Space>
      )}
    </>
  );
};

export { getServerSideProps, ReviewPage };

import { NavBar } from '@components/navBar/NavBar';
import { Content } from 'antd/lib/layout/layout';
import { Button, Input, Typography, Space, Popconfirm, message } from 'antd';
import Head from 'next/head';
import { parseDate } from '@utils/index';
import { Review } from '@utils/types';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@utils/hooks';
import styles from './ReviewPage.module.scss';
import { useMutation } from '@apollo/client';
import { DeleteReview, UpdateReview } from '@graphql/mutations';
import Router from 'next/router';

const { Title, Paragraph } = Typography;

interface ReviewPageProps {
  review: Review;
}

const ReviewPage = ({ review }: ReviewPageProps) => {
  const username = useAppSelector((state) => state.user.username);
  const [showEditButton, setShowEditButton] = useState(false);
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(review.summary);
  const [reviewBody, setReviewBody] = useState(review.body);

  useEffect(() => {
    if (username === review.author.username) {
      setShowEditButton(true);
    }
  }, [username, review]);

  const [updateReview] = useMutation(UpdateReview);
  const [deleteReview] = useMutation(DeleteReview);

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
      Router.push(`/game/${review.subject.title}`);
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
      <NavBar />
      <Content>
        <Title className={styles.title}>{review.subject.title}</Title>
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
          <Button
            className={styles.editButton}
            onClick={() => setEditing(false)}
          >
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
        <Title level={5}>By {review.author.username}</Title>
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
      </Content>
    </>
  );
};

export { ReviewPage };

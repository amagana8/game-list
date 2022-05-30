import { useLazyQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { GetReviews } from '@graphql/queries';
import { ReviewGridType } from '@utils/enums';
import { Review } from '@utils/types';
import { Button, Card, List, Typography } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import styles from './ReviewGrid.module.scss';

const { Paragraph, Title } = Typography;

interface ReviewGridProps {
  reviews: Review[];
  type: ReviewGridType;
  gameId?: string;
}

interface ReviewQueryVariables {
  options: { offset: Number; limit: Number; sort: Object[] };
  where?: { subject: { id: string } };
}

const ReviewGrid = ({ reviews, type, gameId }: ReviewGridProps) => {
  const [list, setList] = useState(reviews);
  const [reachedEnd, setReachedEnd] = useState(false);

  const generateTitle = (review: Review) => {
    switch (type) {
      default:
        return `${review.author.username} - ${review.subject.title}`;
      case ReviewGridType.User:
        return review.subject.title;
      case ReviewGridType.Game:
        return review.author.username;
    }
  };

  const [getMoreReviews, { loading }] = useLazyQuery(GetReviews, {
    onCompleted: (data) => {
      setList((prevState) => [...prevState, ...data.reviews]);
      if (!data.reviews.length) setReachedEnd(true);
    },
  });

  const onLoadMore = () => {
    const variables: ReviewQueryVariables = {
      options: {
        offset: list.length,
        limit: 50,
        sort: [{ createdAt: 'DESC' }],
      },
    };
    if (type === ReviewGridType.Game && gameId) {
      variables.where = {
        subject: {
          id: gameId,
        },
      };
    }
    getMoreReviews({
      variables,
    });
  };

  const LoadMore = () => {
    if (type === ReviewGridType.User) {
      return null;
    } else if (reachedEnd) {
      return (
        <div className={styles.loadMore}>
          <Button disabled>No More Reviews!</Button>
        </div>
      );
    } else if (loading) {
      return <LoadingSpinner />;
    } else {
      return (
        <div className={styles.loadMore}>
          <Button onClick={onLoadMore}>Load More</Button>
        </div>
      );
    }
  };

  return (
    <div>
      {reviews.length ? (
        <List
          className={
            type === ReviewGridType.Home ? styles.reviewList : styles.reviewGrid
          }
          grid={
            type === ReviewGridType.Home
              ? { column: 1 }
              : { gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }
          }
          dataSource={list}
          loadMore={<LoadMore />}
          rowKey={(review: Review) => review.id}
          renderItem={(review: Review) => (
            <Link
              href={`/user/${review.author.username}/reviews/${review.subject.slug}`}
            >
              <a>
                <List.Item>
                  <Card title={generateTitle(review)}>
                    <Paragraph>{review.summary}</Paragraph>
                  </Card>
                </List.Item>
              </a>
            </Link>
          )}
        />
      ) : (
        <Title className={styles.emptyText} level={4}>
          This {type} has no reviews!
        </Title>
      )}
    </div>
  );
};

export { ReviewGrid };

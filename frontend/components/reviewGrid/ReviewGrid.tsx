import { ReviewGridType } from '@utils/enums';
import { Review } from '@utils/types';
import { Card, List, Typography } from 'antd';
import Link from 'next/link';
import styles from './ReviewGrid.module.scss';

const { Paragraph, Title } = Typography;

interface ReviewGridProps {
  reviews: Review[];
  type: ReviewGridType;
}

const ReviewGrid = ({ reviews, type }: ReviewGridProps) => {
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
          dataSource={reviews}
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

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
  return (
    <div>
      {reviews.length ? (
        <List
          className={styles.reviewGrid}
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          dataSource={reviews}
          rowKey={(review: Review) => review.id}
          renderItem={(review: Review) => (
            <Link
              href={`/user/${review.author.username}/reviews/${review.subject.title}`}
            >
              <a>
                <List.Item>
                  <Card
                    title={
                      type === ReviewGridType.User
                        ? review.subject.title
                        : review.author.username
                    }
                  >
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

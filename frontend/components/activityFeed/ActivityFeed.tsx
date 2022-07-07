import { parsePostedDate } from '@utils/parsePostedDate';
import { toTitleCase } from '@utils/toTitleCase';
import { List, Image } from 'antd';
import Link from 'next/link';

interface ActivityFeedProps {
  feedData: any;
}

const ActivityFeed = ({ feedData }: ActivityFeedProps) => (
  <List
    dataSource={feedData}
    renderItem={(item: any, index: number) => (
      <List.Item
        key={index}
        actions={[parsePostedDate(item.date)]}
        extra={
          <Link href={`/game/${item.gameSlug}`}>
            <Image
              src={item.gameCover}
              preview={false}
              width={99}
              height={132}
              alt={`${item.title} Cover`}
            />
          </Link>
        }
      >
        <List.Item.Meta
          title={
            <Link href={`/user/${item.user}`}>
              <a>{item.user}</a>
            </Link>
          }
          description={
            <>
              {toTitleCase(item.status)}{' '}
              <Link href={`/game/${item.gameSlug}`}>{item.gameTitle}</Link>
            </>
          }
        />
      </List.Item>
    )}
  />
);

export { ActivityFeed };

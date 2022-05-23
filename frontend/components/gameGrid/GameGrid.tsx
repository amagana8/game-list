import { Game } from '@utils/types';
import { Card, Image, List } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Link from 'next/link';

const GameGrid = ({ games }: any) => {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
        xxl: 7,
      }}
      dataSource={games}
      renderItem={(game: Game) => (
        <Link href={`/game/${game.slug}`}>
          <a>
            <List.Item>
              <Card
                style={{ width: 198 }}
                hoverable
                cover={
                  <Image
                    src={game.cover}
                    preview={false}
                    width={198}
                    alt={`${game.title} Cover`}
                    fallback="https://i.imgur.com/fac0ifd.png"
                  />
                }
              >
                <Meta description={game.title} />
              </Card>
            </List.Item>
          </a>
        </Link>
      )}
    />
  );
};

export { GameGrid };

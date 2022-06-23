import { useLazyQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { GetTopGames } from '@graphql/queries';
import { GameGridType } from '@utils/enums';
import { Game } from '@utils/types';
import { Button, Card, Image, List } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './GameGrid.module.scss';

interface GameGridProps {
  games: Game[];
  type: GameGridType;
}

const GameGrid = ({ games, type }: GameGridProps) => {
  const [list, setList] = useState(games);
  useEffect(() => {
    setList(games);
  }, [games]);
  const [reachedEnd, setReachedEnd] = useState(false);

  const [getMoreGames, { loading }] = useLazyQuery(GetTopGames, {
    onCompleted: (data) => {
      setList((prevState) => [...prevState, ...data.topGames]);
      if (!data.topGames.length) setReachedEnd(true);
    },
  });

  const onLoadMore = () => {
    getMoreGames({
      variables: {
        offset: list.length,
      },
    });
  };

  const LoadMore = () => {
    if (type === GameGridType.Search || type === GameGridType.Favorites) {
      return null;
    } else if (reachedEnd) {
      return (
        <div className={styles.loadMore}>
          <Button disabled>No More Games!</Button>
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
    <List
      className={
        type === GameGridType.Favorites ? styles.favoritesGrid : styles.gameGrid
      }
      grid={
        type === GameGridType.Home
          ? { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 2 }
          : {
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 7,
            }
      }
      dataSource={list}
      loadMore={<LoadMore />}
      renderItem={(game: Game) => (
        <Link href={`/game/${game.slug}`}>
          <a>
            <List.Item>
              <Card
                style={{ width: 198 }}
                hoverable
                cover={
                  <Image
                    src={game.cover ?? 'error'}
                    preview={false}
                    width={198}
                    height={264}
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

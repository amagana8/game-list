import type { NextPage } from 'next';
import Head from 'next/head';
import { Col, Layout, List, Row, Typography } from 'antd';
import { NavBar } from '@components/navBar/NavBar';
import styles from './HomePage.module.scss';
import { ReviewGrid } from '@components/reviewGrid/ReviewGrid';
import { Review, Game, User } from '@utils/types';
import { ReviewGridType } from '@utils/enums';
import { GameGrid } from '@components/gameGrid/GameGrid';
import Link from 'next/link';

const { Content } = Layout;
const { Title } = Typography;
interface HomePageProps {
  users: User[];
  reviews: Review[];
  games: Game[];
}

const HomePage: NextPage<HomePageProps> = ({
  users,
  games,
  reviews,
}: HomePageProps) => {
  return (
    <>
      <Head>
        <title>Home · GameList</title>
      </Head>
      <NavBar index="1" />
      <Content>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Title>Latest Users</Title>
            <List
              className={styles.users}
              dataSource={users}
              renderItem={(user: User) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link href={`/user/${user.username}`}>
                        <a>{user.username}</a>
                      </Link>
                    }
                    description={`Total Hours: ${user.gameListAggregate.edge.hours.sum}`}
                  />
                </List.Item>
              )}
            ></List>
          </Col>
          <Col span={8}>
            <Title>New Releases</Title>
            <GameGrid games={games} home />
          </Col>
          <Col span={8}>
            <Title>Recent Reviews</Title>
            <ReviewGrid reviews={reviews} type={ReviewGridType.Home} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export { HomePage };

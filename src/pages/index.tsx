import type { NextPage } from 'next';
import Head from 'next/head';
import { Card, Col, Layout, Row, Space, Typography } from 'antd';
import { NavBar } from '@components/navBar';
import styles from '@styles/index.module.scss';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home - GameList</title>
      </Head>
      <NavBar index="1" />
      <Content className={styles.content}>
        <Title>Welcome to GameList!</Title>
        <Space direction="vertical" size={32}>
          <Row gutter={32}>
            <Col>
              <Card title="Keep Track" className={styles.card}>
                <Paragraph>
                  Keep track of all the games {"you've"} played and the time{' '}
                  {"you've"} spent on them. Categorize your games by your
                  playing status such as Playing, Completed, Paused, Dropped,
                  and Planning.
                </Paragraph>
              </Card>
            </Col>
            <Col>
              <Card title="Share with Friends" className={styles.card}>
                <Paragraph>
                  Share your game list with friends. Get a direct link to your
                  list and compare the games {"you've"} played. Give a rating to
                  the games on your list to share your opinions with others.
                </Paragraph>
              </Card>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col>
              <Card title="See Stats" className={styles.card}>
                <Paragraph>
                  See the total hours, days, and years {"you've"} spent playing
                  video games throughout your life. See a distribution of the
                  scores {"you've"} given to games and an overview of the games{' '}
                  {"you've"} played by genre.
                </Paragraph>
              </Card>
            </Col>
            <Col>
              <Card title="Discover new Games" className={styles.card}>
                <Paragraph>
                  Browse through our database of games, see {"others'"} game
                  lists, and find new games to play. See how many other people
                  are playing certain games, their rating distributions, and
                  average scores.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Space>
      </Content>
    </>
  );
};

export default Home;

import type { GetServerSideProps, NextPage } from 'next';
import { client } from '../../apollo-client';
import { GetGame } from '../../graphQLQueries';
import { Typography, Layout, Button } from 'antd';
import { NavBar } from '@components/navBar';
import { AddGameModal } from '@components/addGameModal';
import React, { useState } from 'react';
import styles from '@styles/title.module.scss';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Game {
  id: string;
  title: string;
  publisher: string;
  developer: string;
  summary: string;
  genre: string;
}

interface GameProps {
  game: Game;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { title } = query;
  const { data } = await client.query({
    query: GetGame,
    variables: {
      where: {
        title: title,
      },
    },
  });

  return {
    props: {
      game: data.games[0],
    },
  };
};

const GamePage: NextPage<GameProps> = ({ game }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <NavBar />
      <Content>
        <Title className={styles.gameTitle}>{game.title}</Title>
        <Button
          type="primary"
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          Add to List
        </Button>
        <ul className={styles.list}>
          <li>
            <Text strong>Developer: </Text>
            <Text>{game.developer}</Text>
          </li>
          <li>
            <Text strong>Publisher: </Text>
            <Text>{game.publisher}</Text>
          </li>
          <li>
            <Text strong>Genre: </Text>
            <Text>{game.genre}</Text>
          </li>
        </ul>
        <Paragraph>Summary: {game.summary}</Paragraph>
        <AddGameModal
          showModal={showModal}
          setShowModal={setShowModal}
          gameTitle={game.title}
        />
      </Content>
    </>
  );
};

export default GamePage;

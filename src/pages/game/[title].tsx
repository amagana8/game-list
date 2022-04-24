import type { GetServerSideProps, NextPage } from 'next';
import { client } from '../../apollo-client';
import { GetGame } from '../../graphQLQueries';
import { Typography, Layout, Button } from 'antd';
import { NavBar } from '@components/navBar';
import { AddGameModal } from '@components/addGameModal';
import React, { useState } from 'react';

const { Content } = Layout;
const { Title, Text } = Typography;

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
        <div>
          <Title>{game.title}</Title>
          <Text>Developer: {game.developer}</Text>
        </div>
        <Button type="primary" onClick={() => setShowModal(true)}>
          Add to List
        </Button>
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

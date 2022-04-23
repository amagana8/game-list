import type { GetServerSideProps, NextPage } from 'next';
import { client } from '../../apollo-client';
import { GetGame } from '../../graphQLQueries';
import { Typography, Layout } from 'antd';
import { NavBar } from '@components/navBar';

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
  return (
    <>
      <NavBar />
      <Content>
        <Title>{game.title}</Title>
        <Text>{game.developer}</Text>
      </Content>
    </>
  );
};

export default GamePage;

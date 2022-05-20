import { NavBar } from '@components/navBar/NavBar';
import { Image, Layout, Table, Typography } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { Game } from '@utils/types';
import { useEffect } from 'react';
import { useAppDispatch } from '@utils/hooks';
import { setSearchLoading } from '@slices/searchSlice';

const { Content } = Layout;
const { Title } = Typography;

interface GameSearchPageProps {
  games: Game[];
}

const GameSearchPage = ({ games }: GameSearchPageProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSearchLoading(false));
  }, [games, dispatch]);

  const columns = [
    {
      title: '',
      key: 'action',
      width: 66,
      render: (game: Game) => (
        <Image
          src={game.cover}
          preview={false}
          width={66}
          alt={`${game.title} Cover`}
          fallback="https://i.imgur.com/fac0ifd.png"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text: string) => (
        <Link href={`/game/${text}`}>
          <a>{text}</a>
        </Link>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Search Games · GameList</title>
      </Head>
      <NavBar index="" />
      <Content>
        <Title>Games</Title>
        <Table
          columns={columns}
          dataSource={games.map((row: Game) => ({
            key: row.id,
            title: row.title,
            cover: row.cover,
          }))}
        />
      </Content>
    </>
  );
};

export { GameSearchPage };

import { Image, Table, Typography } from 'antd';
import Link from 'next/link';
import { AlignType } from 'rc-table/lib/interface';
import styles from './GameTable.module.scss';
import { Game } from '@utils/types';

const { Title } = Typography;

interface gameTableProps {
  status: string;
  data: any;
}

interface ListEntry {
  hours: Number;
  score: Number;
  status: string;
  node: Game;
}

const GameTable = ({ status, data }: gameTableProps) => {
  const columns = [
    {
      title: '',
      key: 'action',
      width: '6%',
      render: (game: Game) => (
        <Link href={`/game/${game.slug}`}>
          <a>
            <Image
              src={game.cover}
              preview={false}
              width={66}
              alt={`${game.title} Cover`}
              fallback="https://i.imgur.com/fac0ifd.png"
            />
          </a>
        </Link>
      ),
    },
    {
      title: 'Title',
      key: 'action',
      width: '78%',
      render: (game: Game) => (
        <Link href={`/game/${game.slug}`}>
          <a>{game.title}</a>
        </Link>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      width: '8%',
      align: 'center' as AlignType,
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      width: '8%',
      align: 'center' as AlignType,
    },
  ];

  return (
    <Table
      title={() => (
        <Title level={2} className={styles.title} id={status.toLowerCase()}>
          {status.toLowerCase()}
        </Title>
      )}
      columns={columns}
      dataSource={data.map((row: ListEntry) => ({
        key: row.node.id,
        slug: row.node.slug,
        title: row.node.title,
        cover: row.node.cover,
        score: row.score,
        hours: row.hours,
      }))}
      pagination={false}
    />
  );
};

export { GameTable };

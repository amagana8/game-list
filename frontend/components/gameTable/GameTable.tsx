import { Image, Table, Tag } from 'antd';
import Link from 'next/link';
import { AlignType } from 'rc-table/lib/interface';
import styles from './GameTable.module.scss';
import { Game } from '@utils/types';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/lib/typography/Title';
import { ListEntry } from '@utils/types';

interface gameTableProps {
  status: string;
  data: any;
}

interface TableEntry {
  key: number;
  slug: string;
  title: string;
  cover: string;
  score: number;
  hours: number;
  platforms: string[];
}

const GameTable = ({ status, data }: gameTableProps) => {
  const columns: ColumnsType<TableEntry> = [
    {
      title: 'Cover',
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
      width: '70%',
      sorter: (a: TableEntry, b: TableEntry) => a.title.localeCompare(b.title),
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
      render: (score: number) => {
        if (score === 0) {
          return '';
        } else {
          return score;
        }
      },
      sorter: (a: TableEntry, b: TableEntry) => a.score - b.score,
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      width: '8%',
      align: 'center' as AlignType,
      sorter: (a: TableEntry, b: TableEntry) => a.hours - b.hours,
    },
    {
      title: 'Platform(s)',
      dataIndex: 'platforms',
      width: '8%',
      render: (platforms: string[]) => {
        return platforms?.map((platform: string) => (
          <Tag key={platform} className={styles.tag}>
            {platform}
          </Tag>
        )) as any;
      },
    },
  ];

  const tableData: TableEntry[] = data.map((row: ListEntry) => ({
    key: row.node.id,
    slug: row.node.slug,
    title: row.node.title,
    cover: row.node.cover,
    score: row.score,
    hours: row.hours,
    platforms: row.platforms,
  }));

  return (
    <Table
      title={() => (
        <Title level={2} className={styles.title} id={status.toLowerCase()}>
          {status.toLowerCase()}
        </Title>
      )}
      columns={columns}
      dataSource={tableData}
      pagination={false}
    />
  );
};

export { GameTable };

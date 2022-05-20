import { useQuery } from '@apollo/client';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { Image, Table, Typography } from 'antd';
import { GetList } from '@graphql/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AlignType } from 'rc-table/lib/interface';
import styles from './GameTable.module.scss';
import { Game } from '@utils/types';

const { Title } = Typography;

interface gameTableProps {
  status: string;
}

interface ListEntry {
  hours: Number;
  score: Number;
  status: string;
  node: Game;
}

const GameTable = ({ status }: gameTableProps) => {
  const { username } = useRouter().query;
  const { loading, data } = useQuery(GetList, {
    variables: {
      where: {
        username,
      },
      gameListConnectionWhere: {
        edge: {
          status,
        },
      },
    },
  });

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
      width: '84%',
      render: (text: string) => (
        <Link href={`/game/${text}`}>
          <a>{text}</a>
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
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          title={() => (
            <Title level={2} className={styles.title} id={status}>
              {status}
            </Title>
          )}
          columns={columns}
          dataSource={data.users[0].gameListConnection.edges.map(
            (row: ListEntry) => ({
              key: row.node.id,
              title: row.node.title,
              cover: row.node.cover,
              score: row.score,
              hours: row.hours,
            }),
          )}
          pagination={false}
        />
      )}
    </>
  );
};

export { GameTable };

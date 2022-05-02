import { useQuery } from '@apollo/client';
import { useAppSelector } from 'src/hooks';
import { LoadingSpinner } from '@components/loadingSpinner';
import { Table, Typography } from 'antd';
import { GetList } from '../graphQLQueries';

const { Title } = Typography;

interface gameTableProps {
  status: string;
}

interface Game {
  id: string;
  title: string;
}
interface ListEntry {
  hours: Number;
  score: Number;
  status: string;
  node: Game;
}

const GameTable = ({ status }: gameTableProps) => {
  const username = useAppSelector((state) => state.user.username);
  const { loading, data } = useQuery(GetList, {
    variables: {
      where: {
        username: username,
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
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Score',
      dataIndex: 'score',
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
    },
  ];

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          title={() => <Title id={status}>{status}</Title>}
          columns={columns}
          dataSource={data.users[0].gameListConnection.edges.map(
            (row: ListEntry) => ({
              key: row.node.id,
              title: row.node.title,
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

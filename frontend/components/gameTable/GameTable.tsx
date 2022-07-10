import { Image, Table, Tag, Popover, Select, Button, message } from 'antd';
import Link from 'next/link';
import { AlignType } from 'rc-table/lib/interface';
import styles from './GameTable.module.scss';
import { Game } from '@utils/types';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/lib/typography/Title';
import { ListEntry, TableEntry } from '@utils/types';
import { ListPopover } from '@components/listPopover/ListPopover';
import { PopoverType } from '@utils/enums';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { UpdateListEntry } from '@graphql/mutations';
import { useAuthStore } from '@frontend/authStore';

interface gameTableProps {
  status: string;
  data: any;
  editable: boolean;
}

const GameTable = ({ status, data, editable }: gameTableProps) => {
  const mapTableData = (data: any) =>
    data.map((row: ListEntry) => ({
      key: row.node.id,
      slug: row.node.slug,
      gamePlatforms: row.node.platforms,
      title: row.node.title,
      cover: row.node.cover,
      score: row.score,
      hours: row.hours,
      platforms: row.platforms,
    }));

  const [tableData, setTableData] = useState<TableEntry[]>(mapTableData(data));
  useEffect(() => {
    setTableData(mapTableData(data));
  }, [data]);

  const username = useAuthStore((state) => state.username);
  const [updateListEntry] = useMutation(UpdateListEntry);
  const onChange = async (input: string[], row: TableEntry) => {
    try {
      await updateListEntry({
        variables: {
          where: {
            username,
          },
          update: {
            gameList: [
              {
                update: {
                  edge: {
                    platforms: input,
                  },
                },
                where: {
                  node: {
                    slug: row.slug,
                  },
                },
              },
            ],
          },
          gameListConnectionWhere: {
            node: {
              slug: row.slug,
            },
          },
        },
      });
      const newData = [...tableData];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        platforms: input,
      });
      setTableData(newData);
      message.success(`Platforms for ${row.title} updated!`);
    } catch (e) {
      message.error(`Failed to update platforms for ${row.title}.`);
      console.log(e);
    }
  };

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
      sorter: (a: TableEntry, b: TableEntry) => a.score - b.score,
      render: (value: number, record: TableEntry) => (
        <ListPopover
          value={value}
          row={record}
          type={PopoverType.Score}
          tableData={tableData}
          setTableData={setTableData}
          editable={editable}
        />
      ),
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      width: '8%',
      align: 'center' as AlignType,
      sorter: (a: TableEntry, b: TableEntry) => a.hours - b.hours,
      render: (value: number, record: TableEntry) => (
        <ListPopover
          value={value}
          row={record}
          type={PopoverType.Hours}
          tableData={tableData}
          setTableData={setTableData}
          editable={editable}
        />
      ),
    },
    {
      title: 'Platform(s)',
      dataIndex: 'platforms',
      width: '8%',
      align: 'center' as AlignType,
      render: (value: string[], record: TableEntry) =>
        editable ? (
          <Popover
            title="Platforms"
            trigger="click"
            content={
              <Select
                className={styles.select}
                mode="multiple"
                defaultValue={value}
                options={record.gamePlatforms.map((platform) => ({
                  value: platform.name,
                }))}
                onChange={(values) => onChange(values, record)}
              />
            }
          >
            {value.length ? (
              value.map((platform: string) => (
                <Tag key={platform} className={styles.tag}>
                  {platform}
                </Tag>
              ))
            ) : (
              <Button size="small" icon={<PlusOutlined />} />
            )}
          </Popover>
        ) : (
          <>
            {value.map((platform: string) => (
              <Tag key={platform} className={styles.tag}>
                {platform}
              </Tag>
            ))}
          </>
        ),
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
      dataSource={tableData}
      pagination={false}
    />
  );
};

export { GameTable };

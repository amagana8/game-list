import type { GetStaticPaths, NextPage } from 'next';
import { Layout, Table } from 'antd';
import { NavBar } from '@components/navBar';
import { GetStaticProps } from 'next';
import { GameListModel } from '../../gameListModel';

const { Content } = Layout;

type ListProps = {
  list: any;
};

export const getStaticProps: GetStaticProps = async () => {
  const model = new GameListModel();
  const list = await model.getList('PaleteroMan', 'playing');
  return {
    props: { list }
  };
};

const GameList: NextPage<ListProps> = ({ list }: ListProps) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Score',
      dataIndex: 'score'
    },
    {
      title: 'Hours',
      dataIndex: 'hours'
    }
  ];
  return (
    <>
      <NavBar index="3" />
      <Content>
      <Table
          columns={columns}
          dataSource={list.map((row: any) => ({
            key: row.uid,
            title: row['Game.title'],
            score: row['playing|score'],
            hours: row['playing|hours']
          }))}
          pagination={{ pageSize: 50 }}
        />
      </Content>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const arr: string[] = ['PaleteroMan'];
  
  const paths = arr.map((user) => {
    return { params: { username: user } }
  });

  return {
    paths,
    fallback: false
  };
}

export default GameList;

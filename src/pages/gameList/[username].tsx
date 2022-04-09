import type { GetStaticPaths, NextPage } from 'next';
import { Layout, Table } from 'antd';
import { NavBar } from '@components/navBar';
import { GetStaticProps } from 'next';
import { GetList } from '../../graphQLQueries';
import { client } from "../../apollo-client";

const { Content } = Layout;

type ListProps = {
  list: any;
};

export const getStaticProps: GetStaticProps = async () => {
  const { loading, error, data } = await client.query({
    query: GetList,
    variables: {
      userName: "PaleteroMan",
      status: "playing"
    }
  });

  return {
    props: { 
      list: data.getUser.gameList
    }
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
            key: row.id,
            title: row.game.title,
            score: row.score,
            hours: row.hours
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

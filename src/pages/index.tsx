import type { NextPage } from 'next';
import Head from 'next/head';
import { Layout } from "antd";
import { NavBar } from '@components/navBar';

const { Content } = Layout;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home - GameList</title>
      </Head>
      <NavBar index="1" />
      <Content>
        Welcome
      </Content>
    </>
  );
}

export default Home;
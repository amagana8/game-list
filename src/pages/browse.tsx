import type { NextPage } from 'next';
import { Layout } from "antd";
import { NavBar } from "@components/navBar";


const { Content } = Layout;

const Browse: NextPage = () => {
  return (
    <>
      <NavBar index="2" />
      <Content>
        Browse
      </Content>
    </>
  );
}

export default Browse;
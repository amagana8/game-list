import { NavBar } from '@components/navBar';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Layout, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Content } = Layout;

const SignUp: NextPage = () => {
  function onFinish(values: any) {
    console.log(values);
  }

  return (
    <>
      <Head>
        <title>Sign up for GameList - GameList</title>
      </Head>
      <NavBar />
      <Content>
        <Form
          initialValues={{ remember: true}}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
        </Form>
      </Content>
    </>
  )
}

export default SignUp;

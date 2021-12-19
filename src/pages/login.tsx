import type { NextPage } from 'next';
import Head from 'next/head';
import { Layout, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavBar } from '@components/navBar';
import styles from '@styles/Login.module.css';

const { Content } = Layout;

const Login: NextPage = () => {
  function onFinish(values: any) {
    localStorage.setItem("user", values.username);
  }

  return (
    <>
      <Head>
        <title>Log in to GameList - GameList</title>
      </Head>
      <NavBar />
      <Content>
        <Form
          className={styles.form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.button}>
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
}

export default Login;

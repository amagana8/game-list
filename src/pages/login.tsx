import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { Layout, Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { NavBar } from '@components/navBar';
import styles from '@styles/Login.module.css';

const { Content } = Layout;

interface LogInForm {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  function onFinish(values: LogInForm) {
    console.log(values);
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
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
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
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
          <Form.Item>
            or
            <Link href="/signup">
              <a> register now!</a>
            </Link>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};

export default Login;

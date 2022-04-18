import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { Layout, Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { NavBar } from '@components/navBar';
import styles from '@styles/Login.module.css';
import { ApolloError, useMutation } from '@apollo/client';
import { SignIn } from '../graphQLMutations';

const { Content } = Layout;

interface LogInForm {
  username: string;
  password: string;
}

const Login: NextPage = () => {
  const [signIn] = useMutation(SignIn);

  async function onFinish(values: LogInForm) {
    try {
      const { data } = await signIn({
        variables: {
          username: values.username,
          password: values.password,
        },
      });
      localStorage.setItem('token', data.signIn);
      localStorage.setItem('username', values.username.toLowerCase());
      Router.push('/');
    } catch (error) {
      if (error instanceof ApolloError) {
        message.error(error.message);
      } else {
        console.log(error);
      }
    }
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

import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { Layout, Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { NavBar } from '@components/navBar';
import styles from '@styles/Login.module.scss';
import { ApolloError, useMutation } from '@apollo/client';
import { SignIn } from '../graphQLMutations';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from '@neo4j/graphql/dist/types';
import { useAppDispatch } from '../hooks';
import { login } from '../slices/userSlice';

const { Content } = Layout;

interface LogInForm {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const [signIn] = useMutation(SignIn);
  const dispatch = useAppDispatch();

  async function onFinish(values: LogInForm) {
    try {
      const { data } = await signIn({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
      const decoded = decode(data.signIn) as JwtPayload;
      const user = {
        username: decoded.username,
        token: data.signIn,
      };
      dispatch(login(user));
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
        <title>Login to GameList - GameList</title>
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
              Login
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

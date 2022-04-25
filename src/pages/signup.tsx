import { NavBar } from '@components/navBar';
import type { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { Layout, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from '@styles/Login.module.scss';
import { ApolloError, useMutation } from '@apollo/client';
import { SignUp } from '../graphQLMutations';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from '@neo4j/graphql/dist/types';
import { useAppDispatch } from '../hooks';
import { login } from '../slices/userSlice';

const { Content } = Layout;

interface SignUpForm {
  email: string;
  username: string;
  password: string;
}

const SignUpPage: NextPage = () => {
  const [signUp] = useMutation(SignUp);
  const dispatch = useAppDispatch();

  async function onFinish(values: SignUpForm) {
    try {
      const { data } = await signUp({
        variables: {
          email: values.email,
          username: values.username,
          password: values.password,
        },
      });
      const decoded = decode(data.signUp) as JwtPayload;
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
        <title>Sign up for GameList - GameList</title>
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
            <Button type="primary" htmlType="submit" style={{ width: 100 }}>
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};

export default SignUpPage;

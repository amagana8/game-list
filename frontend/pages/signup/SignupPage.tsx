import { NavBar } from '@components/navBar/NavBar';
import type { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { Layout, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from './SignupPage.module.scss';
import { ApolloError, useMutation } from '@apollo/client';
import { SignUp } from '@graphql/mutations';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from '@neo4j/graphql/dist/types';
import { useAppDispatch } from '@utils/hooks';
import { login } from '@slices/userSlice';
import { UserForm } from '@utils/types';

const { Content } = Layout;

const SignUpPage: NextPage = () => {
  const [signUp] = useMutation(SignUp);
  const dispatch = useAppDispatch();

  async function onFinish(values: UserForm) {
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
        token: data.signUp,
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
        <title>Sign up for GameList · GameList</title>
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
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Not a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your Username!' },
              { min: 2, message: 'Username must be at least 2 characters.' },
              {
                max: 30,
                message: 'Username may not be longer than 30 characters',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your Password!' },
              { min: 8, message: 'Password must be at least 8 characters.' },
              {
                max: 256,
                message: 'Password may not be longer 256 characters.',
              },
            ]}
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

export { SignUpPage };

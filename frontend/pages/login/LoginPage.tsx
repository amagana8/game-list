import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from './LoginPage.module.scss';
import { ApolloError, useMutation } from '@apollo/client';
import { SignIn } from '@graphql/mutations';
import { UserForm } from '@utils/types';
import { useAuthStore } from '@frontend/authStore';

const LoginPage: NextPage = () => {
  const setUser = useAuthStore(state => state.setUser);
  const [signIn] = useMutation(SignIn);

  async function onFinish(values: UserForm) {
    try {
      const { data } = await signIn({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
      setUser(data.signIn);
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
        <title>Login to GameList · GameList</title>
      </Head>
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
    </>
  );
};

export { LoginPage };

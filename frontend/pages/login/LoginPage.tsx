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
import Title from 'antd/lib/typography/Title';

const LoginPage: NextPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
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
      <Title className={styles.title} level={2}>
        Login to GameList
      </Title>
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
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.button}>
            Login
          </Button>
          <div className={styles.link}>
            <Link href="/forgot-password">
              <a>Forgot Password?</a>
            </Link>
          </div>
          <div className={styles.link}>
            <Link href="/signup">
              <a>Create an account</a>
            </Link>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export { LoginPage };

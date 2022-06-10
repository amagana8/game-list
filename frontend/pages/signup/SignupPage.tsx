import type { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from './SignupPage.module.scss';
import { ApolloError, useMutation } from '@apollo/client';
import { SignUp } from '@graphql/mutations';
import { UserForm } from '@utils/types';
import { setUser } from '@frontend/user';

const SignUpPage: NextPage = () => {
  const [signUp] = useMutation(SignUp);

  async function onFinish(values: UserForm) {
    try {
      const { data } = await signUp({
        variables: {
          email: values.email,
          username: values.username,
          password: values.password,
        },
      });
      setUser(data.signUp);
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
    </>
  );
};

export { SignUpPage };

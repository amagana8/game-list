import { ApolloError, useMutation } from '@apollo/client';
import { ForgotPassword } from '@graphql/mutations';
import { Form, message, Input, Button } from 'antd';
import { NextPage } from 'next';
import { MailOutlined } from '@ant-design/icons';
import Head from 'next/head';
import styles from './ForgotPassword.module.scss';
import Router from 'next/router';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: NextPage = () => {
  const [forgotPassword] = useMutation(ForgotPassword);

  async function onFinish(values: ForgotPasswordForm) {
    try {
      await forgotPassword({
        variables: { email: values.email },
      });
      message.success(
        'If an account with that email exists, we sent you an email.',
      );
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
        <title>Forgot Password · GameList</title>
      </Head>
      <Form onFinish={onFinish} className={styles.form}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send Reset Email
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export { ForgotPasswordPage };

import { Button, Form, Input, message } from 'antd';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import { LockOutlined } from '@ant-design/icons';
import { ApolloError, useMutation } from '@apollo/client';
import { ChangePassword } from '@graphql/mutations';
import { useAuthStore } from '@frontend/authStore';
import Head from 'next/head';
import styles from './ChangePassword.module.scss';
import Title from 'antd/lib/typography/Title';

interface changePasswordForm {
  newPassword: string;
}

const ChangePasswordPage: NextPage = () => {
  const { token } = useRouter().query;
  const setUser = useAuthStore((state) => state.setUser);

  const [changePassword] = useMutation(ChangePassword);
  async function onFinish(values: changePasswordForm) {
    try {
      const { data } = await changePassword({
        variables: { token, newPassword: values.newPassword },
      });
      setUser(data.changePassword);
      message.success('Password updated successfully!');
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
        <title>Change Password · GameList</title>
      </Head>
      <Title className={styles.title} level={2}>
        Change Password
      </Title>
      <Form onFinish={onFinish} className={styles.form}>
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: 'Please input your new password!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export { ChangePasswordPage };

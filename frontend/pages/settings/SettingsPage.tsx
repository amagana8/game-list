import type { NextPage } from 'next';
import { Button, Form, Input, message } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { GetUser } from '@graphql/queries';
import { useAppDispatch, useAppSelector } from '@utils/hooks';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { Typography } from 'antd';
import styles from './SettingsPage.module.scss';
import { UpdateUserForm } from '@utils/types';
import { UpdateUserDetails } from '@graphql/mutations';
import { updateUsername } from '@slices/userSlice';

const { Title } = Typography;

const SettingsPage: NextPage = () => {
  const username = useAppSelector((state) => state.user.username);
  const [updateUserDetails] = useMutation(UpdateUserDetails);
  const dispatch = useAppDispatch();

  const { loading, data } = useQuery(GetUser, {
    variables: {
      where: {
        username: username,
      },
    },
  });

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  async function onFinish(input: UpdateUserForm) {
    try {
      const { data } = await updateUserDetails({
        variables: {
          username: username,
          newUsername: input.newUsername,
          newEmail: input.newEmail,
        },
      });
      if (data.updateUserDetails) {
        dispatch(updateUsername(data.updateUserDetails));
      }
      message.success('User updated successfully!');
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
        <title>User Settings · GameList</title>
      </Head>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Title className={styles.title}>User Settings</Title>
          <Form {...layout} onFinish={onFinish} className={styles.form}>
            <Form.Item
              name="newEmail"
              label="Email"
              rules={[{ type: 'email', message: 'Not a valid email!' }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                defaultValue={data.users[0].email}
              />
            </Form.Item>
            <Form.Item
              name="newUsername"
              label="Username"
              rules={[
                {
                  min: 2,
                  message: 'Username must be at least 2 characters.',
                },
                {
                  max: 30,
                  message: 'Username may not be longer than 30 characters',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                defaultValue={data.users[0].username}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};

export { SettingsPage };

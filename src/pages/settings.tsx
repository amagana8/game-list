import type { NextPage } from 'next';
import { Button, Form, Input, message } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavBar } from '@components/navBar';
import { Content } from 'antd/lib/layout/layout';
import Head from 'next/head';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { GetUser } from 'src/graphQLQueries';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { LoadingSpinner } from '@components/loadingSpinner';
import { Typography } from 'antd';
import styles from '@styles/settings.module.scss';
import { UpdateUserForm } from 'src/types';
import { UpdateUserDetails } from 'src/graphQLMutations';
import { updateUsername } from '../slices/userSlice';

const { Title } = Typography;

const Settings: NextPage = () => {
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
        <title>User Settings - GameList</title>
      </Head>
      <NavBar index="" />
      <Content>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Title className={styles.title}>User Settings</Title>
            <Form {...layout} onFinish={onFinish} className={styles.form}>
              <Form.Item name="newEmail" label="Email">
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  defaultValue={data.users[0].email}
                />
              </Form.Item>
              <Form.Item name="newUsername" label="Username">
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
      </Content>
    </>
  );
};

export default Settings;

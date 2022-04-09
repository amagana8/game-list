import { NavBar } from '@components/navBar';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Layout, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from '@styles/Login.module.css';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseApp';
import { useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const { Content } = Layout;

interface SignUpForm {
  email: string
  username: string,
  password: string
};

const SignUp: NextPage = () => {
  const [user, setUser] = useState<any>({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  async function onFinish(values: SignUpForm) {
    try {
      const usersRef = collection(db, 'users');
      const usernameQuery =  query(usersRef, where('username', '==', values.username));
      onSnapshot(usernameQuery, async (snapshot) => {
        if (snapshot.docs.length) {
          message.error('Username has already been taken.')
        } else {
          await createUserWithEmailAndPassword(auth, values.email, values.password);
          message.success(`Signed up with ${user.email}`);
        }
      })
    } catch (error: any) {
      console.log(error);
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
          initialValues={{ remember: true}}
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
            <Button type="primary" htmlType="submit" style={{width: 100}}>
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  )
}

export default SignUp;

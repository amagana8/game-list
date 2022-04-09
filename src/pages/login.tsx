import type { NextPage } from 'next';
import Link from "next/link";
import Head from 'next/head';
import { Layout, Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { NavBar } from '@components/navBar';
import styles from '@styles/Login.module.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseApp';

const { Content } = Layout;

interface LogInForm {
  email: string,
  password: string
}

const Login: NextPage = () => {
  async function onFinish(values: LogInForm) {
    try {
      const login = await signInWithEmailAndPassword(auth, values.email, values.password);
      const userRef = doc(db, 'users', login.user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const username = userSnap.data().username;
        message.success(`Logged in as ${username}`);
      } else {
        message.error("No such user!");
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Log in to GameList - GameList</title>
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
              Log in
            </Button>
          </Form.Item>
          <Form.Item>
            or
            <Link href="/signup">
              <a> register now!</a>
            </Link>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
}

export default Login;

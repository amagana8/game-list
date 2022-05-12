import type { NextPage } from 'next';
import { NavBar } from '@components/navBar';
import { Button, Form, Input, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { Option } from 'antd/lib/mentions';
import styles from '@styles/addGame.module.scss';
import Title from 'antd/lib/typography/Title';
import { useMutation } from '@apollo/client';
import { NewGame } from '../graphQLMutations';
import Router from 'next/router';
import { ListInput } from '@components/listInput';
import { useState } from 'react';
import Head from 'next/head';

interface NewGameForm {
  title: string;
  summary: string;
  genre: string;
}

const AddGame: NextPage = () => {
  const [newGame] = useMutation(NewGame);

  const [developers, setDevelopers] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);

  async function onFinish(input: NewGameForm) {
    try {
      await newGame({
        variables: {
          input: [
            {
              title: input.title,
              developers: developers,
              publishers: publishers,
              summary: input.summary,
              genre: input.genre,
            },
          ],
        },
      });
      Router.push('/browse');
    } catch (error) {
      console.log(error);
    }
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  return (
    <>
      <Head>
        <title>Submit New Game · GameList</title>
      </Head>
      <NavBar index="4" />
      <Content>
        <Title className={styles.title}>Add a New Game</Title>
        <Form
          {...layout}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          onFinish={onFinish}
        >
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Developers" name="developers">
            <ListInput
              inputs={developers}
              setInputs={setDevelopers}
              type="Developer"
            />
          </Form.Item>
          <Form.Item label="Publishers" name="publishers">
            <ListInput
              inputs={publishers}
              setInputs={setPublishers}
              type="Publisher"
            />
          </Form.Item>
          <Form.Item label="Genre" name="genre">
            <Select>
              <Option value="adventure">Adventure</Option>
              <Option value="board">Board</Option>
              <Option value="fighting">Fighting</Option>
              <Option value="horror">Horror</Option>
              <Option value="racing">Racing</Option>
              <Option value="rpg">RPG</Option>
              <Option value="rhythm">Rhythm</Option>
              <Option value="sandbox">Sandbox</Option>
              <Option value="shooter">Shooter</Option>
              <Option value="simulation">Simulation</Option>
              <Option value="sports">Sports</Option>
              <Option value="strategy">Strategy</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Summary" name="summary">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};

export default AddGame;

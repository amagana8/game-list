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

interface NewGameForm {
  title: string;
  developer: string;
  publisher: string;
  summary: string;
  genre: string;
}

const AddGame: NextPage = () => {
  const [newGame] = useMutation(NewGame);

  async function onFinish(input: NewGameForm) {
    try {
      await newGame({
        variables: {
          input: [
            {
              title: input.title,
              developer: input.developer,
              publisher: input.publisher,
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
      <NavBar index="3" />
      <Content>
        <Title className={styles.title}>Add a New Game</Title>
        <Form {...layout} onFinish={onFinish}>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Developer" name="developer">
            <Input />
          </Form.Item>
          <Form.Item label="Publisher" name="publisher">
            <Input />
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

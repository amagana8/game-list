import type { NextPage } from 'next';
import { NavBar } from '@components/navBar/NavBar';
import { Button, Form, Input } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import styles from './AddGamePage.module.scss';
import Title from 'antd/lib/typography/Title';
import { useMutation } from '@apollo/client';
import { NewGame } from '@graphql/mutations';
import Router from 'next/router';
import { ListInput } from '@components/listInput/ListInput';
import { useState } from 'react';
import Head from 'next/head';

interface NewGameForm {
  title: string;
  slug: string;
  cover: string;
  summary: string;
}

const AddGamePage: NextPage = () => {
  const [newGame] = useMutation(NewGame);

  const [developers, setDevelopers] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  async function onFinish(input: NewGameForm) {
    try {
      await newGame({
        variables: {
          input: [
            {
              title: input.title,
              slug: input.slug,
              cover: input.cover,
              developers: developers,
              publishers: publishers,
              summary: input.summary,
              genres: genres,
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
          <Form.Item label="Slug" name="slug">
            <Input />
          </Form.Item>
          <Form.Item label="Cover Image URL" name="cover">
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
          <Form.Item label="Genres" name="genres">
            <ListInput inputs={genres} setInputs={setGenres} type="Genre" />
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

export { AddGamePage };

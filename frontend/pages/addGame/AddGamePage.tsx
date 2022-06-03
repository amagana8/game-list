import type { NextPage } from 'next';
import { NavBar } from '@components/navBar/NavBar';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import styles from './AddGamePage.module.scss';
import Title from 'antd/lib/typography/Title';
import { useMutation } from '@apollo/client';
import { NewGame } from '@graphql/mutations';
import Router from 'next/router';
import { ListInput } from '@components/listInput/ListInput';
import Head from 'next/head';
import { Genre } from '@utils/types';
import { client } from '@frontend/apollo-client';
import { GetGenres } from '@graphql/queries';
import { GetStaticProps } from 'next';

interface NewGameForm {
  title: string;
  slug: string;
  cover: string;
  summary: string;
  releaseDate: any;
  developers: string[];
  publishers: string[];
  genres: string[];
}

interface AddGamePageProps {
  genres: Genre[];
}

const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({ query: GetGenres });

  return {
    props: {
      genres: data.genres,
    },
  };
};

const AddGamePage: NextPage<AddGamePageProps> = ({
  genres,
}: AddGamePageProps) => {
  const [newGame] = useMutation(NewGame);

  async function onFinish(input: NewGameForm) {
    const developerNodes = input.developers.map((devId) => ({
      where: { node: { id: devId } },
    }));
    const publisherNodes = input.publishers.map((pubId) => ({
      where: { node: { id: pubId } },
    }));
    const genreNodes = input.genres.map((genreId) => ({
      where: { node: { id: genreId } },
    }));
    try {
      await newGame({
        variables: {
          input: [
            {
              title: input.title,
              slug: input.slug,
              cover: input.cover,
              releaseDate: input.releaseDate.toISOString(),
              developers: { connect: developerNodes },
              publishers: { connect: publisherNodes },
              summary: input.summary,
              genres: { connect: genreNodes },
            },
          ],
        },
      });
      Router.push(`/game/${input.slug}`);
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
          <Form.Item label="Release Date" name="releaseDate">
            <DatePicker format="MMMM D, YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Developers" name="developers">
            <ListInput />
          </Form.Item>
          <Form.Item label="Publishers" name="publishers">
            <ListInput />
          </Form.Item>
          <Form.Item label="Genres" name="genres">
            <Select
              mode="multiple"
              filterOption={true}
              optionFilterProp="label"
              options={genres.map((genre) => ({
                value: genre.id,
                label: genre.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Summary" name="summary">
            <Input.TextArea rows={8} />
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

export { getStaticProps, AddGamePage };

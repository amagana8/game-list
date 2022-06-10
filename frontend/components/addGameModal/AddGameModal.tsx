import {
  Modal,
  Form,
  Select,
  InputNumber,
  Button,
  message,
  Popconfirm,
} from 'antd';
import { useMutation } from '@apollo/client';
import { AddGame, RemoveGame } from '@graphql/mutations';
import { Status } from '@utils/enums';
import { Game, GameConnection } from '@utils/types';
import styles from './AddGameModal.module.scss';
import { getUser } from '@frontend/user';

const { Option } = Select;

interface AddGameModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<boolean>;
  setGameConnection: React.Dispatch<any>;
  game: Game;
  initialValues?: GameConnection;
}

const AddGameModal = ({
  game,
  initialValues,
  showModal,
  setShowModal,
  setGameConnection,
}: AddGameModalProps) => {
  const [addGame] = useMutation(AddGame);
  const username = getUser().username;
  async function onFinish(input: GameConnection) {
    try {
      await addGame({
        variables: {
          where: {
            username: username,
          },
          connect: {
            gameList: [
              {
                where: {
                  node: {
                    id: game.id,
                  },
                },
                edge: {
                  hours: input.hours,
                  score: input.score,
                  status: input.status,
                },
              },
            ],
          },
        },
      });
      setGameConnection(input);
      message.success('List updated!');
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
  }

  const [removeGame] = useMutation(RemoveGame);
  const onConfirm = async () => {
    try {
      await removeGame({
        variables: {
          where: {
            username,
          },
          disconnect: {
            gameList: [
              {
                where: {
                  node: {
                    id: game.id,
                  },
                },
              },
            ],
          },
        },
      });
      setGameConnection(null);
      message.success('Removed Game!');
    } catch (error) {
      message.error('Failed to remove game.');
      console.log(error);
    }
    setShowModal(false);
  };

  const parseScore = (num: any) => {
    if (num < 0) return 0;
    return Math.round(num / 0.5) * 0.5;
  };

  return (
    <Modal
      title={game.title}
      visible={showModal}
      footer={[
        <Popconfirm
          key="delete"
          title="Are you sure you want to remove this game from your list?"
          okText="Delete"
          okType="danger"
          onConfirm={onConfirm}
        >
          <Button danger={true} type="primary" className={styles.removeButton}>
            Delete Game
          </Button>
        </Popconfirm>,
        <Button key="cancel" onClick={() => setShowModal(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          form="addGameForm"
          htmlType="submit"
        >
          Submit
        </Button>,
      ]}
    >
      <Form id="addGameForm" onFinish={onFinish} initialValues={initialValues}>
        <Form.Item label="Status" name="status">
          <Select>
            <Option value={Status.Playing}>Playing</Option>
            <Option value={Status.Completed}>Completed</Option>
            <Option value={Status.Paused}>Paused</Option>
            <Option value={Status.Dropped}>Dropped</Option>
            <Option value={Status.Planning}>Planning</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Hours" name="hours">
          <InputNumber min={0} precision={1} />
        </Form.Item>
        <Form.Item label="Score" name="score">
          <InputNumber max={10} parser={parseScore} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { AddGameModal };

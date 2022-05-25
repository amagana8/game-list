import { Modal, Form, Select, InputNumber, Button } from 'antd';
import { useMutation } from '@apollo/client';
import { AddGame } from '@graphql/mutations';
import { useAppSelector } from '@utils/hooks';
import { Status } from '@utils/enums';
import { Game } from '@utils/types';

const { Option } = Select;

interface AddGameModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<boolean>;
  game: Game;
  initialValues?: AddGameForm;
}

interface AddGameForm {
  status: string;
  hours: number;
  score: number;
}

const AddGameModal = ({
  game,
  initialValues,
  showModal,
  setShowModal,
}: AddGameModalProps) => {
  const [addGame] = useMutation(AddGame);
  const username = useAppSelector((state) => state.user.username);
  async function onFinish(input: AddGameForm) {
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
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
  }
  return (
    <Modal
      title={game.title}
      visible={showModal}
      footer={[
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
          <InputNumber precision={0} />
        </Form.Item>
        <Form.Item label="Score" name="score">
          <InputNumber min={1} max={10} precision={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { AddGameModal };

import { Modal, Form, Select, InputNumber, Button } from 'antd';
import { useMutation } from '@apollo/client';
import { AddGame } from 'src/graphQLMutations';
import { useAppSelector } from 'src/hooks';

const { Option } = Select;

interface AddGameModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<boolean>;
  gameTitle: string;
}

interface AddGameForm {
  status: string;
  hours: number;
  score: number;
}

const AddGameModal = ({
  gameTitle,
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
            [input.status]: [
              {
                where: {
                  node: {
                    title: gameTitle,
                  },
                },
                edge: {
                  hours: input.hours,
                  score: input.score,
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
      title={gameTitle}
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
      <Form id="addGameForm" onFinish={onFinish}>
        <Form.Item label="Status" name="status">
          <Select>
            <Option value="gamesPlaying">Playing</Option>
            <Option value="gamesCompleted">Completed</Option>
            <Option value="gamesPaused">Paused</Option>
            <Option value="gamesDropped">Dropped</Option>
            <Option value="gamesPlanning">Planning</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Hours" name="hours">
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item label="Score" name="score">
          <InputNumber min={1} max={10}></InputNumber>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { AddGameModal };
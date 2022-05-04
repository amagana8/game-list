import { Typography, Progress, Row, Col } from 'antd';
const { Text } = Typography;

interface UserStatusBarProps {
  section: string;
  amount: number;
  total: number;
}

const StatusCountBar = ({ section, amount, total }: UserStatusBarProps) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={2}>
        <Text>{section}</Text>
      </Col>
      <Col span={6}>
        <Progress
          percent={(amount / total) * 100}
          showInfo={false}
          status="normal"
        />
      </Col>
      <Col span={6}>
        <Text>{amount}</Text>
      </Col>
    </Row>
  );
};

export { StatusCountBar };

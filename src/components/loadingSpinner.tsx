import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = () => (
  <Spin
    style={{ display: 'grid', justifyContent: 'center' }}
    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
  />
);

export { LoadingSpinner };

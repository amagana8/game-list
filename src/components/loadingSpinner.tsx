import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '@styles/loadingSpinner.module.scss';
import { Content } from 'antd/lib/layout/layout';

const LoadingSpinner = () => (
  <Content className={styles.spinner}>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  </Content>
);

export { LoadingSpinner };

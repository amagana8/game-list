import { Treemap } from '@ant-design/plots';
import styles from './TreeMap.module.scss';
import { Empty } from 'antd';

interface TreeMapProps {
  data: TreeMapDataObj[];
}

interface TreeMapDataObj {
  name: string;
  value: number;
}

const TreeMap = ({ data }: TreeMapProps) => {
  const filteredData = data.filter((item: TreeMapDataObj) => item.value);
  const tree = {
    name: 'root',
    children: filteredData,
  };
  const config = {
    data: tree,
    colorField: 'name',
  };
  return (
    <>
      {filteredData.length ? (
        <Treemap {...config} className={styles.treeMap} />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default TreeMap;

import { Treemap } from '@ant-design/plots';
import styles from './TreeMap.module.scss';
import { Empty } from 'antd';

interface TreeMapProps {
  data: GenreCount[];
}

interface GenreCount {
  genre: string;
  amount: number;
}

const TreeMap = ({ data }: TreeMapProps) => {
  const treeData = data.map((item) => ({
    name: item.genre,
    value: item.amount,
  }));

  const tree = {
    name: 'root',
    children: treeData,
  };
  const config = {
    data: tree,
    colorField: 'name',
  };
  return (
    <>
      {treeData.length ? (
        <Treemap {...config} className={styles.treeMap} />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default TreeMap;

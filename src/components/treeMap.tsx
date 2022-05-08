import { Treemap } from '@ant-design/plots';
import styles from '@styles/treeMap.module.scss';

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
  return <Treemap {...config} className={styles.treeMap} />;
};

export default TreeMap;

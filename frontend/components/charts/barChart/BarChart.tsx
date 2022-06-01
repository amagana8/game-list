import { Column } from '@ant-design/plots';
import styles from './BarChart.module.scss';
import { Empty } from 'antd';
import { colorMap } from '@utils/enums';

interface BarChartProps {
  data: ScoreData[];
}

interface ScoreData {
  score: number;
  amount: number;
}

const BarChart = ({ data }: BarChartProps) => {
  const config = {
    color: ({ score }: any) => {
      return colorMap.get(Number(score)) ?? '#177ddc';
    },
    data,
    xField: 'score',
    yField: 'amount',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return (
    <>
      {data.length ? (
        <Column {...config} className={styles.barChart} />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default BarChart;

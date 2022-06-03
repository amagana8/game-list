import { Column } from '@ant-design/plots';
import styles from './BarChart.module.scss';
import { Empty } from 'antd';
import { colorMap } from '@utils/enums';
import { useEffect, useState } from 'react';

interface BarChartProps {
  data: ScoreData[];
}

interface ScoreData {
  score: number;
  amount: number;
}

interface BarChartEntry {
  score: string;
  amount: number;
}

const BarChart = ({ data }: BarChartProps) => {
  const isEmpty = !data.length || data.every((item) => item.score === 0);
  const [barData, setBarData] = useState<BarChartEntry[]>([]);
  useEffect(() => {
    const newData = [];
    for (let i = 1; i < 11; i++) {
      const currItem = data.find((item) => item.score === i);
      if (currItem) {
        newData.push({
          score: currItem.score.toString(),
          amount: currItem.amount,
        });
      } else {
        newData.push({ score: i.toString(), amount: 0 });
      }
    }
    setBarData(newData);
  }, [data]);
  const config = {
    color: ({ score }: any) => {
      return colorMap.get(Number(score)) ?? '#177ddc';
    },
    data: barData,
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
      {isEmpty ? <Empty /> : <Column {...config} className={styles.barChart} />}
    </>
  );
};

export default BarChart;

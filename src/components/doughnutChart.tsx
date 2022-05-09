import { Pie } from '@ant-design/plots';
import styles from '@styles/doughnutChart.module.scss';
import { Empty } from 'antd';

interface DataObj {
  type: string;
  value: number;
}

interface DoughnutChartProps {
  data: DataObj[];
}

const DoughnutChart = ({ data }: DoughnutChartProps) => {
  const filteredData = data.filter((item: DataObj) => item.value);

  const config = {
    color: ({ type }: any) => {
      switch (type) {
        case 'Playing': {
          return '#177ddc';
        }
        case 'Completed': {
          return '#389e0d';
        }
        case 'Paused': {
          return '#d4b106';
        }
        case 'Dropped': {
          return '#cf1322';
        }
        case 'Planning': {
          return '#531dab';
        }
        default: {
          return '#389e0d';
        }
      }
    },
    appendPadding: 10,
    data: filteredData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        style: {
          color: '#ffffffd9',
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '2rem',
          color: '#ffffffd9',
        },
      },
    },
    legend: {
      itemName: {
        style: {
          fill: '#ffffffd9',
        },
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  };
  return (
    <>
      {filteredData.length ? (
        <Pie {...config} className={styles.chart} />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default DoughnutChart;

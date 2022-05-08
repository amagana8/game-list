import { Column } from '@ant-design/plots';
import styles from '@styles/barChart.module.scss';

interface BarChartProps {
  data: ScoreData[];
}

interface ScoreData {
  score: string | undefined;
  amount: number;
}

const BarChart = ({ data }: BarChartProps) => {
  const config = {
    color: ({score}: any) => {
      switch(score) {
        case '1': {
          return '#a8071a'
        }
        case '2': {
          return '#cf1322';
        }
        case '3': {
          return '#d4380d';
        }
        case '4': {
          return '#d46b08';
        }
        case '5': {
          return '#d48806';
        }
        case '6': {
          return '#d4b106';
        }
        case '7': {
          return '#cad803';
        }
        case '8': {
          return '#7cb305';
        }
        case '9': {
          return '#59ad05';
        }
        case '10': {
          return '#389e0d';
        }
        default: {
          return '#177ddc';
        }
      }
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

  return <Column {...config} className={styles.barChart} />;
};

export default BarChart;

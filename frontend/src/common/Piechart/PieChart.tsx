import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface PieChartProps {
  totalMobileClicks: number;
  totalDesktopClicks: number;
}

const PieChart: React.FC<PieChartProps> = ({ totalMobileClicks, totalDesktopClicks }) => {
  const data = {
    labels: ['Mobile', 'Desktop'],
    datasets: [
      {
        data: [totalMobileClicks, totalDesktopClicks],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default PieChart;

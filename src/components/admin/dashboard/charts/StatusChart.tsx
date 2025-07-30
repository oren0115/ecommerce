import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card, CardBody, CardHeader } from '@heroui/react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface StatusChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100/50">
      <CardHeader className="pb-0">
        <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
      </CardHeader>
      <CardBody className="p-6">
        <div className="h-64 flex items-center justify-center">
          <Pie data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default StatusChart; 
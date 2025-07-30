import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader } from '@heroui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OrdersChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

const OrdersChart: React.FC<OrdersChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          stepSize: 1,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100/50">
      <CardHeader className="flex items-center justify-between pb-0">
        <h3 className="text-lg font-semibold text-gray-900">Orders Trend</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Orders</span>
        </div>
      </CardHeader>
      <CardBody className="p-6">
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default OrdersChart; 
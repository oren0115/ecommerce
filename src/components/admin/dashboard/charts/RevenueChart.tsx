import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardHeader } from '@heroui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
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
          callback: function(value: any) {
            if (value >= 1000000) {
              return `Rp ${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `Rp ${(value / 1000).toFixed(1)}K`;
            }
            return `Rp ${value}`;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
      },
    },
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100/50">
      <CardHeader className="flex items-center justify-between pb-0">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
      </CardHeader>
      <CardBody className="p-6">
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default RevenueChart; 
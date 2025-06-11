// An abstraction for line chart

import DashboardContent from "./DashboardContent/DashboardContent.tsx";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

interface props {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
}

function LineChart({ title, labels, data, colors }: props) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderColor: "white",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const options = {
    borderWidth: 5,
    plugins: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false,
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // X-axis grid color
          borderColor: "rgba(255, 255, 255, 0.1)", // X-axis line color
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Y-axis grid color
          borderColor: "rgba(255, 255, 255, 0.1)", // Y-axis line color
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  return (
    <>
      <DashboardContent
        title={title}
        value={<Line data={chartData} options={options} />}
      />
    </>
  );
}

export default LineChart;

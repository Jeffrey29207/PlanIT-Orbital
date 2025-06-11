// An abstraction for doughnut chart

import DashboardContent from "./DashboardContent/DashboardContent.tsx";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface props {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
}

function DoughnutChart({ title, labels, data, colors }: props) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
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
  };

  return (
    <>
      <DashboardContent
        title={title}
        value={<Doughnut data={chartData} options={options} />}
      />
    </>
  );
}

export default DoughnutChart;

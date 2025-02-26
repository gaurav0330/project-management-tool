import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const WorkloadChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.tasks),
        backgroundColor: ["#4F46E5", "#F59E0B", "#10B981"],
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">Workload Distribution</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default WorkloadChart;

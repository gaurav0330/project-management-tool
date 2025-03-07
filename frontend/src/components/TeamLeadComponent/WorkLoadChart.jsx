import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "chart.js/auto";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const WorkloadChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.tasks),
        backgroundColor: [
          "#4F46E5", // Indigo
          "#F59E0B", // Amber
          "#10B981", // Green
          "#EF4444", // Red
          "#3B82F6", // Blue
        ],
        hoverOffset: 10, // 3D hover effect
        borderWidth: 3,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-white to-gray-100 shadow-lg rounded-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Workload Distribution
      </h3>
      <div className="relative">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                labels: {
                  color: "#374151",
                  font: { size: 14, weight: "bold" },
                },
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const value = tooltipItem.raw;
                    return ` ${value} Tasks`;
                  },
                },
              },
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
          }}
        />
      </div>

      {/* Numerical Data Display */}
      <div className="mt-4 text-center">
        <h4 className="text-md font-semibold text-gray-700 mb-2">
          Task Breakdown
        </h4>
        <ul className="text-sm space-y-2">
          {data.map((user, index) => (
            <li
              key={index}
              className="flex justify-between bg-gray-200 rounded-lg p-2 shadow-sm hover:bg-gray-300 transition"
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-gray-700 font-bold">{user.tasks} tasks</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkloadChart;

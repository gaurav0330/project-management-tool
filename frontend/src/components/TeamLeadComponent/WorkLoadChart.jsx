import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "chart.js/auto";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const WorkloadChart = ({ data = [] }) => {
  const colors = [
    "#6366f1", // brand-primary-500
    "#f59e0b", // warning-500
    "#10b981", // success-500
    "#ef4444", // error-500
    "#3b82f6", // info-500
    "#a855f7", // brand-secondary-500
    "#f43f5e", // pink-500 (backup if many users)
  ];

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.tasks),
        backgroundColor: colors,
        hoverOffset: 10,
        borderWidth: 3,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="card w-full">
      {/* Chart Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark tracking-tight">
          Workload Distribution
        </h2>
        <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
          Visual breakdown of task assignments by member
        </p>
      </div>

      {/* Chart */}
      <div className="relative max-w-sm mx-auto">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                labels: {
                  color: "var(--txt-secondary-light)",
                  font: {
                    size: 13,
                    family: "Inter, sans-serif",
                    weight: "500",
                  },
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

      {/* Task Breakdown List */}
      <div className="mt-8 px-2">
        <h4 className="text-sm font-semibold text-heading-accent mb-3 px-1">
          Task Breakdown
        </h4>

        {data.length === 0 ? (
          <p className="text-muted text-sm text-center">No data available</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.map((user, index) => (
              <li
                key={index}
                className="flex items-center justify-between border border-gray-200 dark:border-gray-700 bg-bg-accent-light dark:bg-bg-accent-dark transition-all p-3 rounded-lg shadow-sm hover:shadow-md"
              >
                <span className="truncate font-medium text-txt-primary-light dark:text-txt-primary-dark">
                  {user.name}
                </span>
                <span className="text-sm font-semibold text-brand-primary-600 dark:text-brand-primary-400">
                  {user.tasks} tasks
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WorkloadChart;

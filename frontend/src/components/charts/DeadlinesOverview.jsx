import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertTriangle,
  Clock,
  Target,
  TrendingDown,
  FastForward,
  Activity,
  User,
  Hash
} from "lucide-react";
import dayjs from "dayjs";

const GET_DEADLINES_OVERVIEW = gql`
  query GetOverdueAndUpcomingTasks($projectId: ID!) {
    getOverdueAndUpcomingTasks(projectId: $projectId) {
      overdueTasks {
        taskId
        title
        dueDate
        assignedTo
      }
      upcomingTasks {
        taskId
        title
        dueDate
        assignedTo
      }
    }
  }
`;

const DeadlinesOverview = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_DEADLINES_OVERVIEW, {
    variables: { projectId },
  });

  if (loading) {
    return (
      <div className="p-4 xs:p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3 mb-4 xs:mb-6">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-36 xs:w-48"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 xs:mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 xs:h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-56 xs:h-80 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 xs:mb-6"></div>
          <div className="h-32 xs:h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 xs:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 xs:w-16 xs:h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-base xs:text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1 xs:mb-2">
              Unable to Load Deadlines
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-xs xs:text-base">
              Error loading deadlines data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const overdueTasks = data.getOverdueAndUpcomingTasks.overdueTasks;
  const upcomingTasks = data.getOverdueAndUpcomingTasks.upcomingTasks;
  const totalTasks = overdueTasks.length + upcomingTasks.length;

  if (totalTasks === 0) {
    return (
      <div className="p-4 xs:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 xs:w-16 xs:h-16 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-txt-secondary-light dark:text-txt-secondary-dark" />
          </div>
          <div>
            <h3 className="text-base xs:text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1 xs:mb-2">
              No Deadlines to Track
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-xs xs:text-base">
              Task deadlines will appear here once they are set.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const today = dayjs();
  const totalOverdueDays = overdueTasks.reduce((sum, task) => sum + today.diff(dayjs(task.dueDate), "day"), 0);
  const avgOverdueDays = overdueTasks.length ? (totalOverdueDays / overdueTasks.length).toFixed(1) : 0;

  const sortedUpcoming = [...upcomingTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const nextDeadline = sortedUpcoming.length ? dayjs(sortedUpcoming[0].dueDate).format("MMM DD, YYYY") : "None";

  // Transform data for Bar Chart
  const groupedData = {};
  [...overdueTasks, ...upcomingTasks].forEach((task) => {
    const date = dayjs(task.dueDate).format("MMM DD");
    if (!groupedData[date]) {
      groupedData[date] = { date, Overdue: 0, Upcoming: 0 };
    }
    groupedData[date][overdueTasks.includes(task) ? "Overdue" : "Upcoming"] += 1;
  });

  const chartData = Object.values(groupedData).sort((a, b) => 
    new Date(dayjs(a.date, "MMM DD").format("YYYY-MM-DD")) - 
    new Date(dayjs(b.date, "MMM DD").format("YYYY-MM-DD"))
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-2 xs:p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1 xs:mb-2">
            {label}
          </p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-xs xs:text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} tasks
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200/50 dark:border-blue-700/50"
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200/50 dark:border-red-700/50"
    },
    {
      title: "Upcoming Tasks",
      value: upcomingTasks.length,
      icon: Clock,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200/50 dark:border-green-700/50"
    },
    {
      title: "Avg. Overdue Days",
      value: `${avgOverdueDays}`,
      icon: TrendingDown,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200/50 dark:border-orange-700/50"
    },
    {
      title: "Next Deadline",
      value: nextDeadline,
      icon: FastForward,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200/50 dark:border-purple-700/50"
    }
  ];

  return (
    <div className="p-2 xs:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6 flex-wrap">
          <div className="p-2 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg xs:text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
              Deadlines & Milestones
            </h2>
            <p className="text-xs xs:text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Track upcoming deadlines and overdue tasks
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-4 mb-4 xs:mb-6"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className={`p-2 xs:p-4 rounded-xl ${stat.bgColor} border ${stat.borderColor} hover:scale-105 transition-all duration-300 flex flex-col`}
              >
                <div className="flex items-center gap-2 mb-1 xs:mb-2">
                  <div className={`p-1 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                    <IconComponent className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] xs:text-xs font-medium text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                    {stat.title}
                  </span>
                </div>
                <p className="text-base xs:text-lg font-bold text-heading-primary-light dark:text-heading-primary-dark">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card mb-4 xs:mb-6"
        >
          <div className="p-2 xs:p-4">
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2 xs:mb-4">
              Deadline Distribution
            </h3>
            <div className="w-full h-52 xs:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-txt-primary-light dark:text-txt-primary-dark"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-txt-primary-light dark:text-txt-primary-dark"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="Overdue" fill="#ef4444" name="Overdue Tasks" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Upcoming" fill="#10b981" name="Upcoming Tasks" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Task List Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <div className="p-2 xs:p-4">
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2 xs:mb-4">
              Task Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs xs:text-base">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 xs:py-3 xs:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      <div className="flex items-center gap-1 xs:gap-2">
                        <Hash className="w-4 h-4" />
                        Task ID
                      </div>
                    </th>
                    <th className="text-left py-2 px-2 xs:py-3 xs:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      Title
                    </th>
                    <th className="text-left py-2 px-2 xs:py-3 xs:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      <div className="flex items-center gap-1 xs:gap-2">
                        <Calendar className="w-4 h-4" />
                        Due Date
                      </div>
                    </th>
                    <th className="text-left py-2 px-2 xs:py-3 xs:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      <div className="flex items-center gap-1 xs:gap-2">
                        <User className="w-4 h-4" />
                        Assigned To
                      </div>
                    </th>
                    <th className="text-left py-2 px-2 xs:py-3 xs:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...overdueTasks, ...upcomingTasks].map((task, index) => {
                    const isOverdue = overdueTasks.includes(task);
                    const daysFromNow = dayjs(task.dueDate).diff(today, 'day');
                    return (
                      <motion.tr
                        key={task.taskId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-colors"
                      >
                        <td className="py-2 px-2 xs:py-3 xs:px-4">
                          <span className="font-mono text-xs xs:text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                            {task.taskId}
                          </span>
                        </td>
                        <td className="py-2 px-2 xs:py-3 xs:px-4">
                          <span className="font-medium text-heading-primary-light dark:text-heading-primary-dark">
                            {task.title}
                          </span>
                        </td>
                        <td className="py-2 px-2 xs:py-3 xs:px-4">
                          <div className="flex items-center gap-1 xs:gap-2">
                            <span className="text-txt-primary-light dark:text-txt-primary-dark">
                              {dayjs(task.dueDate).format("MMM DD, YYYY")}
                            </span>
                            {!isOverdue && daysFromNow <= 3 && (
                              <span className="inline-flex items-center px-1 xs:px-2 py-1 rounded-full text-[10px] xs:text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                                Soon
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-2 xs:py-3 xs:px-4">
                          <span className="text-txt-primary-light dark:text-txt-primary-dark">
                            {task.assignedTo}
                          </span>
                        </td>
                        <td className="py-2 px-2 xs:py-3 xs:px-4">
                          <span className={`inline-flex items-center px-1 xs:px-2 py-1 rounded-full text-[10px] xs:text-xs font-medium ${
                            isOverdue 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          }`}>
                            {isOverdue ? (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Upcoming
                              </>
                            )}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default DeadlinesOverview;

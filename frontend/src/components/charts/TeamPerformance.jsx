import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList 
} from "recharts";
import { useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Activity,
  AlertCircle,
  Trophy
} from "lucide-react";

const GET_TEAM_PERFORMANCE = gql`
  query GetTeamPerformance($projectId: ID!) {
    getTeamPerformance(projectId: $projectId) {
      teamId
      teamName
      totalTasksAssigned
      completedTasks
      completionRate
    }
  }
`;

const TeamPerformanceBarChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TEAM_PERFORMANCE, {
    variables: { projectId },
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 sm:w-48"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full h-52 sm:h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="w-full lg:w-1/2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 sm:h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-md sm:text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Unable to Load Performance Data
            </h3>
            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Error loading team performance data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const teams = data?.getTeamPerformance || [];
  if (teams.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-txt-secondary-light dark:text-txt-secondary-dark" />
          </div>
          <div>
            <h3 className="text-md sm:text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              No Team Data Available
            </h3>
            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Team performance data will appear here once teams are created.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const maxTasks = Math.max(...teams.map(team => team.totalTasksAssigned), 10);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const team = teams.find(t => t.teamName === label);
      return (
        <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-2 sm:p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
            {label}
          </p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-xs sm:text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          {team && (
            <p className="text-xs sm:text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
              Completion Rate: {team.completionRate.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const topPerformer = teams.reduce((prev, current) => 
    (prev.completionRate > current.completionRate) ? prev : current
  );

  return (
    <div className="p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 rounded-xl shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
              Team Performance Overview
            </h2>
            <p className="text-xs sm:text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Track individual team productivity and completion rates
            </p>
          </div>
        </div>
        {/* Top Performer Badge */}
        {topPerformer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                  Top Performer: {topPerformer.teamName}
                </p>
                <p className="text-xs sm:text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                  {topPerformer.completionRate.toFixed(1)}% completion rate
                </p>
              </div>
            </div>
          </motion.div>
        )}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="card p-2 sm:p-4 min-h-[250px] sm:min-h-[400px]">
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" minWidth={300} height={250}>
                  <BarChart data={teams} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="teamName" 
                      tick={{ fontSize: 10, fill: 'currentColor' }} 
                      className="text-txt-primary-light dark:text-txt-primary-dark"
                    />
                    <YAxis 
                      domain={[0, maxTasks]} 
                      tick={{ fontSize: 10, fill: 'currentColor' }} 
                      className="text-txt-primary-light dark:text-txt-primary-dark"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar 
                      dataKey="totalTasksAssigned" 
                      fill="#10b981" 
                      name="Total Tasks"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList dataKey="totalTasksAssigned" position="top" />
                    </Bar>
                    <Bar 
                      dataKey="completedTasks" 
                      fill="#f59e0b" 
                      name="Completed Tasks"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList dataKey="completedTasks" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
          {/* Team Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-96 space-y-2 sm:space-y-4 shrink-0"
          >
            {teams.map((team, index) => (
              <motion.div
                key={team.teamId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="card p-2 sm:p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-lg">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-heading-primary-light dark:text-heading-primary-dark text-sm sm:text-base">
                      {team.teamName}
                    </h3>
                  </div>
                  {team.teamId === topPerformer.teamId && (
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="w-3 h-3 text-txt-secondary-light dark:text-txt-secondary-dark" />
                      <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Total</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                      {team.totalTasksAssigned}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Done</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-success">
                      {team.completedTasks}
                    </p>
                  </div>
                </div>
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xs font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      Completion Rate
                    </span>
                    <span className="text-xs font-bold text-heading-primary-light dark:text-heading-primary-dark">
                      {team.completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${team.completionRate}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="pt-2 sm:pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary-600" />
                    <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                      {team.completedTasks > 0 ? 'Active' : 'Starting'} team
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamPerformanceBarChart;

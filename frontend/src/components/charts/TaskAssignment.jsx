import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  User,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  Target,
  Eye,
} from "lucide-react";
import dayjs from "dayjs";

const GET_TASKS_HISTORY = gql`
  query GetTasksHistory($projectId: ID!) {
    getTasksHistory(projectId: $projectId) {
      taskId
      title
      history {
        updatedBy
        updatedAt
        oldStatus
        newStatus
        updatedByName
      }
    }
  }
`;

const statusCategories = [
  { 
    name: "To Do", 
    color: "bg-gray-50 dark:bg-gray-800/50", 
    borderColor: "border-gray-300 dark:border-gray-600",
    headerColor: "bg-gray-100 dark:bg-gray-700",
    textColor: "text-gray-700 dark:text-gray-300",
    icon: <Target className="w-4 h-4" />,
    gradient: "from-gray-400 to-gray-500"
  },
  { 
    name: "In Progress", 
    color: "bg-yellow-50 dark:bg-yellow-900/20", 
    borderColor: "border-yellow-300 dark:border-yellow-600",
    headerColor: "bg-yellow-100 dark:bg-yellow-800/50",
    textColor: "text-yellow-700 dark:text-yellow-300",
    icon: <Play className="w-4 h-4" />,
    gradient: "from-yellow-400 to-yellow-500"
  },
  { 
    name: "Needs Revision", 
    color: "bg-red-50 dark:bg-red-900/20", 
    borderColor: "border-red-300 dark:border-red-600",
    headerColor: "bg-red-100 dark:bg-red-800/50",
    textColor: "text-red-700 dark:text-red-300",
    icon: <RotateCcw className="w-4 h-4" />,
    gradient: "from-red-400 to-red-500"
  },
  { 
    name: "Done", 
    color: "bg-green-50 dark:bg-green-900/20", 
    borderColor: "border-green-300 dark:border-green-600",
    headerColor: "bg-green-100 dark:bg-green-800/50",
    textColor: "text-green-700 dark:text-green-300",
    icon: <CheckCircle className="w-4 h-4" />,
    gradient: "from-green-400 to-green-500"
  },
  { 
    name: "Pending Approval", 
    color: "bg-blue-50 dark:bg-blue-900/20", 
    borderColor: "border-blue-300 dark:border-blue-600",
    headerColor: "bg-blue-100 dark:bg-blue-800/50",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: <Pause className="w-4 h-4" />,
    gradient: "from-blue-400 to-blue-500"
  },
  { 
    name: "Approved", 
    color: "bg-purple-50 dark:bg-purple-900/20", 
    borderColor: "border-purple-300 dark:border-purple-600",
    headerColor: "bg-purple-100 dark:bg-purple-800/50",
    textColor: "text-purple-700 dark:text-purple-300",
    icon: <Eye className="w-4 h-4" />,
    gradient: "from-purple-400 to-purple-500"
  },
  { 
    name: "Completed", 
    color: "bg-emerald-50 dark:bg-emerald-900/20", 
    borderColor: "border-emerald-300 dark:border-emerald-600",
    headerColor: "bg-emerald-100 dark:bg-emerald-800/50",
    textColor: "text-emerald-700 dark:text-emerald-300",
    icon: <TrendingUp className="w-4 h-4" />,
    gradient: "from-emerald-400 to-emerald-500"
  },
];

const TaskStatusTimeline = ({ projectId }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  
  const { loading, error, data } = useQuery(GET_TASKS_HISTORY, {
    variables: { projectId },
  });

  if (loading) {
    return (
      <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark min-h-full p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-primary-200 dark:border-brand-primary-700 border-t-brand-primary-600 dark:border-t-brand-primary-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Loading task timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark min-h-full p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Error Loading Timeline
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Organize tasks by status & count totals
  const taskMap = {};
  const statusCounts = {};
  statusCategories.forEach((status) => {
    taskMap[status.name] = [];
    statusCounts[status.name] = 0;
  });

  data?.getTasksHistory?.forEach((task) => {
    if (task.history.length > 0) {
      const latestStatus = task.history[task.history.length - 1];
      taskMap[latestStatus.newStatus]?.push({ ...task, latestStatus });
      statusCounts[latestStatus.newStatus] += 1;
    }
  });

  const onDragEnd = (result) => {
    console.log("Drag is disabled, no updates allowed.");
  };

  const totalTasks = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark min-h-full">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
                Task Timeline
              </h1>
              <p className="text-lg text-txt-secondary-light dark:text-txt-secondary-dark">
                Track task progress across different stages
              </p>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            {statusCategories.map(({ name, borderColor, headerColor, textColor, icon, gradient }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: statusCategories.findIndex(s => s.name === name) * 0.1 }}
                className={`card p-4 hover:scale-105 transition-all duration-300 ${borderColor} border-l-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
                    {icon}
                  </div>
                  <h3 className="text-xs font-medium text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                    {name}
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                    {statusCounts[name] || 0}
                  </p>
                  {totalTasks > 0 && (
                    <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                      ({Math.round(((statusCounts[name] || 0) / totalTasks) * 100)}%)
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {statusCategories.map(({ name, color, borderColor, headerColor, textColor, icon, gradient }, columnIndex) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
                  className={`min-w-[280px] ${color} rounded-2xl border ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {/* Column Header */}
                  <div className={`${headerColor} p-4 rounded-t-2xl border-b ${borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}>
                          {icon}
                        </div>
                        <div>
                          <h2 className={`font-heading font-bold ${textColor} text-lg`}>
                            {name}
                          </h2>
                          <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                            {taskMap[name].length} tasks
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${gradient} text-white text-sm font-bold shadow-md`}>
                        {taskMap[name].length}
                      </span>
                    </div>
                  </div>

                  {/* Tasks Container */}
                  <Droppable droppableId={name} isDropDisabled={true}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps} 
                        className={`p-4 min-h-[400px] space-y-3 transition-all duration-200 ${
                          snapshot.isDraggingOver ? 'bg-opacity-80' : ''
                        }`}
                      >
                        <AnimatePresence>
                          {taskMap[name].length > 0 ? (
                            taskMap[name].map((task, index) => (
                              <Draggable 
                                key={task.taskId} 
                                draggableId={task.taskId} 
                                index={index} 
                                isDragDisabled={true}
                              >
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`bg-bg-primary-light dark:bg-bg-primary-dark p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                                      snapshot.isDragging ? 'rotate-3 scale-105' : ''
                                    }`}
                                    onClick={() => setSelectedTask(task)}
                                  >
                                    {/* Task Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                      <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                                        {icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-heading-primary-light dark:text-heading-primary-dark text-sm line-clamp-2 group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors">
                                          {task.title}
                                        </h3>
                                      </div>
                                    </div>

                                    {/* Task Details */}
                                    <div className="space-y-2 text-xs">
                                      <div className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                          {dayjs(Number(task.latestStatus.updatedAt)).format("MMM DD, HH:mm")}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark">
                                        <User className="w-3 h-3" />
                                        <span className="truncate">
                                          {task.latestStatus.updatedByName}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white shadow-sm`}>
                                        Updated
                                      </span>
                                    </div>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center justify-center py-12 text-center"
                            >
                              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} opacity-20 flex items-center justify-center mb-4`}>
                                {icon}
                              </div>
                              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                                No tasks in this stage
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              ))}
            </div>
          </DragDropContext>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 p-4 bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Timeline last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Total: {totalTasks} tasks
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskStatusTimeline;

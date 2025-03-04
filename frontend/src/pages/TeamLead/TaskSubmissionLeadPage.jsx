import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "./TaskList";
import TaskDetails from "./TaskDetiledLead";

const GET_TASKS_FOR_LEAD = gql`
  query GetTasksForLead($teamLeadId: ID!, $projectId: ID!) {
    getTasksForLead(teamLeadId: $teamLeadId, projectId: $projectId) {
      id
      title
      description
      status
      priority
      dueDate
      updatedAt
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      success
      message
      task {
        id
        status
      }
    }
  }
`;

const getTeamLeadIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function TaskSubmissionPage({ projectId }) {
  const teamLeadId = getTeamLeadIdFromToken();
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const { loading, error, data } = useQuery(GET_TASKS_FOR_LEAD, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
  });

  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);

  const handleStatusChange = (status) => {
    if (!isCompleted) {
      setTaskStatus(status);
    }
  };

  const handleMarkAsDone = async () => {
    if (!selectedTask) return;

    try {
      const { data } = await updateTaskStatus({
        variables: { taskId: selectedTask.id, status: "Done" },
      });

      if (data.updateTaskStatus.success) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const renderContent = () => {
    if (!teamLeadId) {
      return <p className="text-center text-red-500">Unauthorized: No valid token found.</p>;
    }

    if (loading) {
      return <p className="text-center text-gray-500">Loading tasks...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500">Error fetching tasks: {error.message}</p>;
    }

    const tasks = data?.getTasksForLead || [];

    return (
      <>
        <motion.div className="w-2/5 p-4 bg-white shadow-md rounded-lg">
          <TaskList tasks={tasks} onSelectTask={(task) => {
            setSelectedTask(task);
            setTaskStatus(task.status);
            setIsCompleted(task.status === "Done");
          }} />
        </motion.div>
        <div className="flex-1 p-6 bg-gray-50 rounded-lg shadow-md">
          <AnimatePresence>
            {selectedTask ? (
              <TaskDetails
                selectedTask={selectedTask}
                taskStatus={taskStatus}
                isCompleted={isCompleted}
                handleStatusChange={handleStatusChange}
                handleMarkAsDone={handleMarkAsDone}
                files={files}
                setFiles={setFiles}
              />
            ) : (
              <motion.p className="text-gray-500 text-center">Select a task to view details.</motion.p>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <h1 className="text-3xl font-bold text-center my-4">Task Management</h1>
      <div className="flex flex-grow">
        {renderContent()}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import TaskHeader from "../../components/TeamMember/TaskHeader";
import ProgressBar from "../../components/TeamMember/ProgressBar";
import FileUpload from "../../components/TeamMember/FileUpload";
import AttachmentList from "../../components/TeamMember/Attachment";

// 🔹 GraphQL Queries & Mutations
const GET_TASK_BY_ID = gql`
  query GetTaskById($taskId: ID!) {
    getTaskById(taskId: $taskId) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      attachments
      remarks
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
        title
        status
        updatedAt
      }
    }
  }
`;

const SEND_TASK_FOR_APPROVAL = gql`
  mutation SendTaskForApproval($taskId: ID!) {
    sendTaskForApproval(taskId: $taskId) {
      success
      message
      task {
        id
        status
      }
    }
  }
`;

const TaskSubmissionPage = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();

  // 🔹 Fetch Task Data
  const { data, loading, error, refetch } = useQuery(GET_TASK_BY_ID, {
    variables: { taskId },
    skip: !taskId, // Prevent query execution if taskId is missing
  });

  const [updateTaskStatus, { loading: updating }] = useMutation(UPDATE_TASK_STATUS, {
    onCompleted: () => refetch(), // Refresh task data after update
  });

  const [sendTaskForApproval, { loading: approving }] = useMutation(SEND_TASK_FOR_APPROVAL, {
    onCompleted: () => {
      refetch(); // Refresh task data after sending for approval
      alert("Task sent for approval!");
    },
  });

  const [status, setStatus] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false); // Track if task was marked as completed

  // 🔹 Update status when data is fetched
  useEffect(() => {
    if (data?.getTaskById?.status) {
      setStatus(data.getTaskById.status);
      setIsCompleted(data.getTaskById.status === "Completed"); // Set flag if task is completed
    }
  }, [data]);

  // 🔹 Handle Status Update
  const handleStatusUpdate = async () => {
    if (!status || status === "Done") return; // Prevent going back from Done

    try {
      await updateTaskStatus({ variables: { taskId, status: "Done" } });
      alert(`Task status updated to Done!`);
      setStatus("Done");
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🔹 Handle Sending Task for Approval
  const handleSendForApproval = async () => {
    if (status !== "Done") return; // Only send if status is "Done"

    try {
      await sendTaskForApproval({ variables: { taskId } });
    } catch (err) {
      console.error("Error sending task for approval:", err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center text-gray-500">Loading task details...</div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center text-red-500">Error: {error.message}</div>
    </div>
  );

  const task = data?.getTaskById;
  if (!task) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center text-gray-500">Task not found</div>
    </div>
  );

  return (
    <motion.div
  className="max-w-4xl p-8 mx-auto my-8 space-y-8 transition-all duration-300 bg-white shadow-xl rounded-2xl"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* 🔹 Back Button */}
  <motion.button
    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-transform transform bg-gray-100 rounded-lg shadow hover:bg-gray-200 hover:shadow-md hover:scale-105"
    onClick={() => navigate(`/teamMember/project/${projectId}`)}
  >
    <ArrowLeft size={18} className="mr-2" />
    Back to Dashboard
  </motion.button>

  {/* 🔹 Task Header */}
  <TaskHeader title={task.title} dueDate={task.dueDate} priority={task.priority} />

  {/* 🔹 Task Description */}
  <motion.div
    className="p-4 border border-gray-200 rounded-lg shadow-inner bg-gray-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <p className="text-gray-700">{task.description}</p>
  </motion.div>

  {/* 🔹 Progress Bar */}
  <ProgressBar status={status} />

  {/* 🔹 Dynamic Status Buttons */}
  <div className="mt-6 space-y-4">
    {status === "Completed" ? (
      // ✅ Show checkmark for Completed tasks
      <motion.div
        className="flex items-center p-4 text-green-600 rounded-lg shadow bg-green-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle size={24} className="mr-2" />
        <span className="text-lg font-semibold">Task Completed</span>
      </motion.div>
    ) : status === "Pending Approval" ? (
      // ❌ No buttons for Pending Approval
      <div className="font-medium text-yellow-600">Pending Approval</div>
    ) : status === "Done" ? (
      // ✅ Only show "Send for Approval" for Done tasks
      <motion.button
        className="px-6 py-3 text-white transition-transform transform bg-green-500 rounded-lg shadow hover:bg-green-600 hover:scale-105"
        onClick={handleSendForApproval}
        disabled={approving}
      >
        {approving ? "Processing..." : "Send for Approval"}
      </motion.button>
    ) : (
      // ✅ Show "Mark as Done" for To Do / In Progress
      <motion.button
        className="px-6 py-3 text-white transition-transform transform bg-blue-500 rounded-lg shadow hover:bg-blue-600 hover:scale-105"
        onClick={handleStatusUpdate}
        disabled={updating}
      >
        {updating ? "Processing..." : "Mark as Done"}
      </motion.button>
    )}
  </div>
</motion.div>

  );
};

export default TaskSubmissionPage;

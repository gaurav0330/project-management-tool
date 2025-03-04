import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, CheckCircle } from "lucide-react"; // ✅ Added CheckCircle icon
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

  if (loading) return <p className="text-center text-gray-500">Loading task details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  const task = data?.getTaskById;
  if (!task) return <p className="text-center text-gray-500">Task not found</p>;

  return (
    <div className="max-w-4xl p-6 mx-auto my-6 space-y-6 bg-white rounded-lg shadow-lg">
      {/* 🔹 Back Button */}
      <button
        className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        onClick={() => navigate("/teammemberdashboard")}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </button>

      {/* 🔹 Task Header */}
      <TaskHeader title={task.title} dueDate={task.dueDate} priority={task.priority} />

      {/* 🔹 Task Description */}
      <p className="text-gray-600">{task.description}</p>

      {/* 🔹 Progress Bar */}
      <ProgressBar status={status} />

      {/* 🔹 Dynamic Status Buttons */}
      <div className="mt-4">
        {status === "Completed" ? (
          // ✅ Show checkmark for Completed tasks
          <div className="flex items-center text-green-600">
            <CheckCircle size={24} className="mr-2" />
            <span className="text-lg font-semibold">Task Completed</span>
          </div>
        ) : status === "Pending Approval" ? (
          // ❌ No buttons for Pending Approval
          null
        ) : status === "Done" ? (
          // ✅ Only show "Send for Approval" for Done tasks
          <button
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            onClick={handleSendForApproval}
            disabled={approving}
          >
            {approving ? "Processing..." : "Send for Approval"}
          </button>
        ) : (
          // ✅ Show "Mark as Done" for To Do / In Progress
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleStatusUpdate}
            disabled={updating}
          >
            {updating ? "Processing..." : "Mark as Done"}
          </button>
        )}
      </div>

      {/* 🔹 File Upload */}
      <div className="flex items-center gap-2">
        <UploadCloud size={24} className="text-blue-500" />
        <FileUpload />
      </div>

      {/* 🔹 Attachments List */}
      <AttachmentList files={task.attachments || []} />
    </div>
  );
};

export default TaskSubmissionPage;

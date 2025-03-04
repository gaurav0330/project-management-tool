import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react"; // ✅ Lucide Icons
import TaskHeader from "../../components/TeamMember/TaskHeader";
import ProgressBar from "../../components/TeamMember/ProgressBar";
import FileUpload from "../../components/TeamMember/FileUpload";
import AttachmentList from "../../components/TeamMember/Attachment";

// 🔹 GraphQL Query
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

const TaskSubmissionPage = () => {
  const navigate = useNavigate();
  
  // 🔹 Static Task ID
  const taskId = "67c5cfaba451690f5b5b77d6";

  // 🔹 Fetch Task Data
  const { data, loading, error } = useQuery(GET_TASK_BY_ID, {
    variables: { taskId },
    skip: !taskId, 
  });

  console.log("Task ID:", taskId);

  const [progress, setProgress] = useState(75);
  const [status, setStatus] = useState("In Progress");
  const [files, setFiles] = useState([]);

  // 🔹 Handle File Upload
  const handleFileUpload = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // 🔹 Handle File Delete
  const handleDeleteFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
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
      <ProgressBar progress={progress} status={status} setStatus={setStatus} />

      {/* 🔹 File Upload */}
      <div className="flex items-center gap-2">
        <UploadCloud size={24} className="text-blue-500" />
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      {/* 🔹 Attachments List */}
      <AttachmentList files={files} onDelete={handleDeleteFile} />
    </div>
  );
};

export default TaskSubmissionPage;

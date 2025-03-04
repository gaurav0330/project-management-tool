import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useMutation, gql } from '@apollo/client';

// Define the mutation for sending the task for approval
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

// ProgressBar Component
const ProgressBar = ({ status }) => {
  let progress = 0;
  let color = '';

  switch (status) {
    case 'To Do':
      progress = 0;
      color = 'bg-gray-300'; // Gray
      break;
    case 'In Progress':
      progress = 50;
      color = 'bg-lightblue-500'; // Light Blue
      break;
    case 'Done':
      progress = 100;
      color = 'bg-blue-500'; // Blue
      break;
    case 'Pending Approval':
      progress = 75; // Assuming Pending Approval is between In Progress and Done
      color = 'bg-yellow-500'; // Yellow
      break;
    case 'Completed':
      progress = 100; // Fully completed
      color = 'bg-green-500'; // Green
      break;
    default:
      break;
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div className={`h-4 rounded-full ${color}`} style={{ width: `${progress}%` }}></div>
    </div>
  );
};

const TaskDetails = ({ selectedTask, taskStatus, isCompleted, handleStatusChange, handleMarkAsDone, files, setFiles }) => {
  const [message, setMessage] = useState("");
  const [sendTaskForApproval] = useMutation(SEND_TASK_FOR_APPROVAL);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, application/pdf",
    onDrop: (acceptedFiles) => setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]),
  });

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", message);
    setMessage("");
  };

  const handleSendForApproval = async () => {
    if (!selectedTask) return;

    try {
      const { data } = await sendTaskForApproval({
        variables: { taskId: selectedTask.id },
      });

      if (data.sendTaskForApproval.success) {
        // Update the task status to "Pending Approval"
        handleStatusChange("Pending Approval");
      }
    } catch (err) {
      console.error("Error sending task for approval:", err);
    }
  };

  return (
    <motion.div
      key={selectedTask.id}
      className="border p-6 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800">{selectedTask.title}</h2>
      <p className="text-gray-600 mt-2">{selectedTask.description}</p>

      {/* Progress Bar */}
      <ProgressBar status={taskStatus} />

      <div className="flex gap-2 mt-4">
        <button className={`px-4 py-2 rounded-md transition-colors duration-200 ${taskStatus === "To Do" ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => handleStatusChange("To Do")} disabled={isCompleted || taskStatus === "Done" || taskStatus === "Pending Approval" || taskStatus === "Completed"}>To Do</button>
        <button className={`px-4 py-2 rounded-md transition-colors duration-200 ${taskStatus === "In Progress" ? "bg-lightblue-500 text-white" : "bg-gray-300"}`} onClick={() => handleStatusChange("In Progress")} disabled={isCompleted || taskStatus === "Done" || taskStatus === "Pending Approval" || taskStatus === "Completed"}>In Progress</button>
        <button className={`px-4 py-2 rounded-md transition-colors duration-200 ${taskStatus === "Done" ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => handleStatusChange("Done")} disabled={isCompleted || taskStatus === "Done" || taskStatus === "Pending Approval" || taskStatus === "Completed"}>Done</button>
      </div>
      {taskStatus === "Done" && !isCompleted && (
        <>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-md mt-2 transition-transform duration-200 hover:scale-105" onClick={handleMarkAsDone}>Mark as Completed</button>
        </>
      )}
      {taskStatus === "Done" && isCompleted && (
        <>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 transition-transform duration-200 hover:scale-105" onClick={handleSendForApproval}>Send for Approval</button>
        </>
      )}
      {taskStatus === "Pending Approval" && (
        <p className="mt-2 text-yellow-600">Status: Pending Approval</p>
      )}
      {taskStatus === "Completed" && (
        <p className="mt-2 text-green-600">Status: Completed</p>
      )}
      <div {...getRootProps()} className="border-dashed border-2 p-6 text-center mt-4 bg-gray-100 rounded-md cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
      </div>
      <ul className="mt-2 text-sm text-gray-600">
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>

      <form onSubmit={handleMessageSubmit} className="mt-4">
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your message here..."
          className="w-full p-2 border rounded-md"
          rows="3"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md transition-transform duration-200 hover:scale-105">Send Message</button>
      </form>
    </motion.div>
  );
};

export default TaskDetails;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useMutation, gql } from '@apollo/client';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaTasks,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFlag,
  FaBullseye,
  FaFileUpload,
  FaFile,
  FaPaperPlane,
  FaSpinner,
  FaTrash,
  FaDownload,
  FaEdit,
  FaUser,
  FaInfoCircle,
  FaTimesCircle
} from 'react-icons/fa';

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

// Enhanced ProgressBar Component
const ProgressBar = ({ status, className = "" }) => {
  const getProgressData = (status) => {
    switch (status) {
      case 'To Do':
        return { progress: 10, color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700' };
      case 'In Progress':
        return { progress: 60, color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'Done':
        return { progress: 85, color: 'from-purple-400 to-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' };
      case 'Pending Approval':
        return { progress: 90, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' };
      case 'Completed':
        return { progress: 100, color: 'from-green-400 to-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' };
      default:
        return { progress: 0, color: 'from-gray-300 to-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700' };
    }
  };

  const { progress, color, bgColor } = getProgressData(status);

  return (
    <div className={`w-full ${bgColor} rounded-full h-3 mb-6 overflow-hidden ${className}`}>
      <motion.div 
        className={`h-full rounded-full bg-gradient-to-r ${color} shadow-sm`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
          {status}
        </span>
        <span className="text-xs font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
          {progress}%
        </span>
      </div>
    </div>
  );
};

const TaskDetails = ({ 
  selectedTask, 
  taskStatus, 
  isCompleted, 
  handleStatusChange, 
  handleMarkAsDone, 
  files, 
  setFiles,
  updateLoading,
  getPriorityColor,
  getStatusColor 
}) => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [sendingApproval, setSendingApproval] = useState(false);

  const [sendTaskForApproval] = useMutation(SEND_TASK_FOR_APPROVAL);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      showNotification("success", `${acceptedFiles.length} file(s) added successfully`);
    },
    onDropRejected: (rejectedFiles) => {
      showNotification("error", "Some files were rejected. Please check file types.");
    }
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showNotification("error", "Please enter a message");
      return;
    }
    
    console.log("Message sent:", message);
    showNotification("success", "Message sent successfully");
    setMessage("");
  };

  const handleSendForApproval = async () => {
    if (!selectedTask) return;

    setSendingApproval(true);
    try {
      const { data } = await sendTaskForApproval({
        variables: { taskId: selectedTask.id },
      });

      if (data.sendTaskForApproval.success) {
        handleStatusChange("Pending Approval");
        showNotification("success", "Task sent for approval successfully!");
      } else {
        showNotification("error", data.sendTaskForApproval.message || "Failed to send for approval");
      }
    } catch (err) {
      console.error("Error sending task for approval:", err);
      showNotification("error", "An error occurred while sending for approval");
    }
    setSendingApproval(false);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
    showNotification("success", "File removed successfully");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="w-4 h-4" />;
      case 'Pending Approval': return <FaClock className="w-4 h-4" />;
      case 'In Progress': return <FaSpinner className="w-4 h-4" />;
      case 'Done': return <FaFlag className="w-4 h-4" />;
      default: return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <FaFlag className="w-4 h-4 text-red-500" />;
      case 'Medium': return <FaBullseye className="w-4 h-4 text-yellow-500" />;
      case 'Low': return <FaBullseye className="w-4 h-4 text-green-500" />;
      default: return <FaBullseye className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const statusButtons = [
    { status: 'To Do', color: 'from-gray-500 to-gray-600', icon: FaExclamationTriangle },
    { status: 'In Progress', color: 'from-blue-500 to-blue-600', icon: FaSpinner },
    { status: 'Done', color: 'from-purple-500 to-purple-600', icon: FaFlag }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            <div className={`p-4 rounded-xl shadow-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? (
                  <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <FaTimesCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p className={`text-sm font-medium ${
                  notification.type === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={selectedTask.id}
        className="flex-1 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {/* Task Header */}
        <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-3 flex items-center gap-3">
                <FaTasks className="w-6 h-6 text-brand-primary-500" />
                {selectedTask.title}
              </h2>
              
              {selectedTask.description && (
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark leading-relaxed">
                  {selectedTask.description}
                </p>
              )}
            </div>
          </div>

          {/* Task Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Due Date */}
            {selectedTask.dueDate && (
              <div className="flex items-center gap-3 p-3 bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl">
                <FaCalendarAlt className="w-5 h-5 text-brand-primary-500" />
                <div>
                  <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Due Date</p>
                  <p className={`font-body font-semibold ${
                    isOverdue(selectedTask.dueDate) 
                      ? 'text-red-500' 
                      : 'text-txt-primary-light dark:text-txt-primary-dark'
                  }`}>
                    {formatDate(selectedTask.dueDate)}
                    {isOverdue(selectedTask.dueDate) && (
                      <span className="text-red-500 text-xs ml-2">⚠️ Overdue</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Priority */}
            {selectedTask.priority && (
              <div className="flex items-center gap-3 p-3 bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl">
                {getPriorityIcon(selectedTask.priority)}
                <div>
                  <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Priority</p>
                  <p className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                    {selectedTask.priority}
                  </p>
                </div>
              </div>
            )}

            {/* Current Status */}
            <div className="flex items-center gap-3 p-3 bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl">
              {getStatusIcon(taskStatus)}
              <div>
                <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Status</p>
                <p className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  {taskStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20">
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-4 flex items-center gap-2">
            <FaInfoCircle className="w-5 h-5 text-brand-primary-500" />
            Task Progress
          </h3>
          <ProgressBar status={taskStatus} />
        </div>

        {/* Status Control Section */}
        <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20">
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-4 flex items-center gap-2">
            <FaEdit className="w-5 h-5 text-brand-primary-500" />
            Update Status
          </h3>
          
          {/* Status Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {statusButtons.map(({ status, color, icon: Icon }) => (
              <motion.button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isCompleted || taskStatus === "Done" || taskStatus === "Pending Approval" || taskStatus === "Completed"}
                className={`p-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  taskStatus === status
                    ? `bg-gradient-to-r ${color} text-white shadow-lg`
                    : isCompleted || taskStatus === "Done" || taskStatus === "Pending Approval" || taskStatus === "Completed"
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark hover:shadow-md border border-gray-200 dark:border-gray-600'
                }`}
                whileHover={
                  !(isCompleted || taskStatus === "Done" || taskStatus === "Pending Approval" || taskStatus === "Completed") && taskStatus !== status
                    ? { scale: 1.02 } 
                    : {}
                }
                whileTap={
                  !(isCompleted || taskStatus === "Done" || taskStatus === "Pending Approval" || taskStatus === "Completed") && taskStatus !== status
                    ? { scale: 0.98 } 
                    : {}
                }
              >
                <Icon className="w-4 h-4" />
                {status}
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <AnimatePresence mode="wait">
            {taskStatus === "Done" && !isCompleted && (
              <motion.button
                onClick={handleMarkAsDone}
                disabled={updateLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {updateLoading ? <FaSpinner className="w-5 h-5 animate-spin" /> : <FaCheckCircle className="w-5 h-5" />}
                {updateLoading ? "Marking as Completed..." : "Mark as Completed"}
              </motion.button>
            )}

            {taskStatus === "Done" && isCompleted && (
              <motion.button
                onClick={handleSendForApproval}
                disabled={sendingApproval}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {sendingApproval ? <FaSpinner className="w-5 h-5 animate-spin" /> : <FaPaperPlane className="w-5 h-5" />}
                {sendingApproval ? "Sending for Approval..." : "Send for Approval"}
              </motion.button>
            )}

            {taskStatus === "Pending Approval" && (
              <motion.div
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3">
                  <FaClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-body font-semibold text-yellow-800 dark:text-yellow-200">
                      Pending Approval
                    </p>
                    <p className="font-body text-sm text-yellow-600 dark:text-yellow-400">
                      Your task is waiting for manager approval
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {taskStatus === "Completed" && (
              <motion.div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-body font-semibold text-green-800 dark:text-green-200">
                      Task Completed
                    </p>
                    <p className="font-body text-sm text-green-600 dark:text-green-400">
                      Congratulations! This task has been completed successfully
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* File Upload Section */}
        <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20">
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-4 flex items-center gap-2">
            <FaFileUpload className="w-5 h-5 text-brand-primary-500" />
            File Attachments
          </h3>
          
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-brand-primary-500 bg-brand-primary-50 dark:bg-brand-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-brand-primary-400 hover:bg-bg-primary-light dark:hover:bg-bg-primary-dark'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              className="flex flex-col items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center">
                <FaFileUpload className="w-6 h-6 text-brand-primary-500" />
              </div>
              <div>
                <p className="font-body font-medium text-txt-primary-light dark:text-txt-primary-dark">
                  {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
                </p>
                <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                  Supports: Images, PDF, DOC, DOCX
                </p>
              </div>
            </motion.div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark mb-3">
                Uploaded Files ({files.length})
              </h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FaFile className="w-4 h-4 text-brand-primary-500" />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark truncate">
                          {file.name}
                        </p>
                        <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => removeFile(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Section */}
        <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20">
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-4 flex items-center gap-2">
            <FaPaperPlane className="w-5 h-5 text-brand-primary-500" />
            Add Comment
          </h3>
          
          <form onSubmit={handleMessageSubmit} className="space-y-4">
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Add a comment about this task, ask questions, or provide updates..."
              className="w-full p-4 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200 resize-none"
              rows="4"
            />
            <motion.button
              type="submit"
              disabled={!message.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                message.trim()
                  ? 'bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={message.trim() ? { scale: 1.02 } : {}}
              whileTap={message.trim() ? { scale: 0.98 } : {}}
            >
              <FaPaperPlane className="w-4 h-4" />
              Send Comment
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;

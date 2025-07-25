import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, CheckCircle, Clock, FileText, Upload, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- GraphQL Queries ---
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
      attachments { name size type }
      remarks
    }
  }
`;
const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      success message task { id title status updatedAt }
    }
  }
`;
const SEND_TASK_FOR_APPROVAL = gql`
  mutation SendTaskForApproval($taskId: ID!) {
    sendTaskForApproval(taskId: $taskId) {
      success message task { id status }
    }
  }
`;
const ADD_TASK_ATTACHMENT = gql`
  mutation AddTaskAttachment($taskId: ID!, $attachment: AttachmentInput!) {
    addTaskAttachment(taskId: $taskId, attachment: $attachment) {
      success message task { id attachments { name size type } }
    }
  }
`;

const TaskSubmissionPage = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const fileInputRef = useRef();

  const { data, loading, error, refetch } = useQuery(GET_TASK_BY_ID, { variables: { taskId }, skip: !taskId });

  // --- Mutations
  const [updateTaskStatus, { loading: updating }] = useMutation(UPDATE_TASK_STATUS, { onCompleted: () => refetch() });
  const [sendTaskForApproval, { loading: approving }] = useMutation(SEND_TASK_FOR_APPROVAL, {
    onCompleted: () => { refetch(); notify('success', "Task sent for approval!"); },
  });
  const [addTaskAttachment, { loading: addingAttachment }] = useMutation(ADD_TASK_ATTACHMENT, {
    onCompleted: () => { refetch(); notify('success', "File attached!"); },
    onError: (err) => notify('error', err.message)
  });

  // --- Status UI state
  const [status, setStatus] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (data?.getTaskById?.status) setStatus(data.getTaskById.status);
  }, [data]);

  function notify(type, message) {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification((p) => ({ ...p, show: false })), 2200);
  }

  // --- Status Handlers
  const handleStatusUpdate = async () => {
    if (!status || status === "Done") return;
    await updateTaskStatus({ variables: { taskId, status: "Done" } });
    setStatus("Done");
    notify("success", "Marked as Done!");
  };

  const handleSendForApproval = async () => {
    if (status !== "Done") return;
    await sendTaskForApproval({ variables: { taskId } });
  };

  // --- Attachments upload
  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newAttachment = { name: file.name, size: file.size, type: file.type };
    await addTaskAttachment({ variables: { taskId, attachment: newAttachment } });
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    if (addingAttachment) return;
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const newAttachment = { name: file.name, size: file.size, type: file.type };
    await addTaskAttachment({ variables: { taskId, attachment: newAttachment } });
  };
  const handleDragOver = (e) => e.preventDefault();

  // --- Data Shortcuts
  const task = data?.getTaskById;

  // --- UI Helpers ---
  const getStatusShade = (status) =>
    status === "Completed" ? "bg-green-50 text-green-700 border-green-200"
    : status === "Pending Approval" ? "bg-yellow-50 text-yellow-700 border-yellow-300"
    : status === "Done" ? "bg-blue-50 text-blue-700 border-blue-300"
    : "bg-gray-50 text-gray-700 border-gray-200";

  // --- Render
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      <div className="text-center text-brand-primary-500 font-heading animate-pulse text-xl">Loading task details...</div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      <div className="text-center text-red-600">Error: {error.message}</div>
    </div>
  );
  if (!task) return (
    <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
      <div className="text-center text-txt-secondary-light dark:text-txt-secondary-dark">Task not found</div>
    </div>
  );

  return (
    <motion.div
      className="max-w-4xl mx-auto my-12 p-8 bg-bg-primary-light dark:bg-bg-primary-dark rounded-3xl shadow-2xl space-y-8 border border-bg-accent-light dark:border-bg-accent-dark"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <AnimatePresence>
        {notification.show && (
          <NotificationBanner
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification((p) => ({ ...p, show: false }))}
          />
        )}
      </AnimatePresence>

      {/* --- Top bar --- */}
      <div className="flex items-center justify-between border-b pb-4 mb-4 border-bg-accent-light dark:border-bg-accent-dark">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-accent-light dark:bg-bg-accent-dark text-heading-primary-light dark:text-heading-primary-dark shadow hover:scale-105 transition"
          onClick={() => navigate(`/teamMember/project/${projectId}`)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </motion.button>
        <span className={`font-body rounded-full px-3 py-1 border text-xs font-semibold uppercase shadow-sm tracking-wide ${getStatusShade(status)}`}>
          {status}
        </span>
      </div>

      {/* --- Task Title & Meta --- */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
          {task.title}
        </h1>
        <div className="flex flex-wrap gap-4 items-center text-txt-secondary-light dark:text-txt-secondary-dark mb-2">
          <span className="bg-bg-accent-light dark:bg-bg-accent-dark px-2 py-1 rounded-lg text-xs font-medium">Priority: <b>{task.priority}</b></span>
          <span className="bg-bg-accent-light dark:bg-bg-accent-dark px-2 py-1 rounded-lg text-xs font-medium">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
          <span className="bg-bg-accent-light dark:bg-bg-accent-dark px-2 py-1 rounded-lg text-xs font-medium">Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="font-body text-lg mt-2">{task.description}</p>
        {task.remarks && <p className="text-sm italic text-yellow-700 mt-2">Remarks: {task.remarks}</p>}
      </div>

      {/* --- ProgressBar --- */}
      <ProgressBar status={status} />

      {/* --- Attachment List --- */}
      <AttachmentList attachments={task.attachments} />

      {/* --- File Upload --- */}
      <motion.div
        className="mt-2 bg-bg-secondary-light dark:bg-bg-secondary-dark border-2 border-dashed border-bg-accent-light dark:border-bg-accent-dark p-8 rounded-2xl text-center shadow-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="mb-3 flex flex-col items-center gap-2">
          <UploadCloud className="w-8 h-8 text-brand-primary-500" />
          <span className="font-semibold text-txt-secondary-light dark:text-txt-secondary-dark">Attach your files (PDF, DOC, PNG etc)</span>
        </div>
        <motion.button
          className="bg-brand-primary-500 text-white px-6 py-2 rounded-xl mt-2 font-medium shadow hover:bg-brand-primary-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={addingAttachment}
        >
          {addingAttachment ? "Uploading..." : "Choose File"}
        </motion.button>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileInput}
          disabled={addingAttachment}
        />
        <div className="mt-2 text-xs text-txt-muted-light dark:text-txt-muted-dark">Or drag and drop here</div>
      </motion.div>

      {/* --- Status Actions Modern --- */}
      <div className="mt-6">
        {status === "Completed" ? (
          <motion.div
            className="flex items-center gap-2 justify-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="text-lg font-semibold text-green-700 dark:text-green-200">Task Completed</span>
          </motion.div>
        ) : status === "Pending Approval" ? (
          <div className="flex items-center justify-center gap-2 text-yellow-700 font-semibold p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow">
            <Clock className="w-5 h-5" /> Pending Approval
          </div>
        ) : status === "Done" ? (
          <motion.button
            className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow transition-transform transform-gpu hover:scale-105"
            whileHover={{ scale: 1.02 }}
            onClick={handleSendForApproval}
            disabled={approving}
          >
            {approving ? "Processing..." : "Send for Approval"}
          </motion.button>
        ) : (
          <motion.button
            className="w-full md:w-auto px-8 py-3 bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold rounded-xl shadow transition-transform transform-gpu hover:scale-105"
            whileHover={{ scale: 1.02 }}
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

// --- Modern Attachment List
const AttachmentList = ({ attachments }) => (
  <div className="mt-4">
    <h4 className="font-semibold mb-2 flex items-center gap-1 text-heading-primary-light dark:text-heading-primary-dark">
      <FileText className="w-5 h-5" /> Attachments
    </h4>
    {attachments && attachments.length ? (
      <ul className="space-y-2">
        {attachments.map((att, i) => (
          <li key={i} className="flex gap-3 items-center bg-bg-accent-light dark:bg-bg-accent-dark px-4 py-2 rounded-xl">
            <FileText className="w-5 h-5 text-brand-primary-500" />
            <span className="font-body font-medium">{att.name}</span>
            <span className="ml-auto text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
              {att.size ? `${(att.size / 1024).toFixed(1)} KB` : ""}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-xs text-txt-muted-light dark:text-txt-muted-dark px-2">No attachments uploaded yet.</div>
    )}
  </div>
);

// --- Modern ProgressBar
const ProgressBar = ({ status }) => {
  const progress = status === "Completed" ? 1
    : status === "Pending Approval" ? 0.9
    : status === "Done" ? 0.75
    : status === "In Progress" ? 0.5
    : 0;
  return (
    <div className="my-4">
      <div className="w-full bg-bg-accent-light dark:bg-bg-accent-dark rounded-full h-3">
        <motion.div
          className="h-3 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-1 px-1">
        <span>To Do</span>
        <span>In Progress</span>
        <span>Done</span>
        <span>Pending Approval</span>
        <span>Completed</span>
      </div>
    </div>
  );
};

// --- NotificationBanner
const NotificationBanner = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full p-4 rounded-xl flex gap-3 items-center shadow-xl ring-1 ring-opacity-20
    ${type === 'success' ? 'bg-green-50 ring-green-400 border-green-300 text-green-900'
      : 'bg-red-50 ring-red-400 border-red-300 text-red-900' }`}
  >
    {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-auto"><X className="w-4 h-4" /></button>
  </motion.div>
);

export default TaskSubmissionPage;

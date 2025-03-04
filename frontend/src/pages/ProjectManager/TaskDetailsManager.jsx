import { FileText, User, CalendarDays } from "lucide-react";
import Attachments from "../../components/tasks/Attachments";
import Feedback from "./FeedBackManager";
import { motion } from "framer-motion";

export default function TaskDetails({ task }) {
  if (!task) return <p className="text-gray-500 text-center">Select a task to view details</p>;

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      case "Approved":
        return "bg-green-100 text-green-700 border-green-400";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  return (
    <motion.div 
      className="p-6 bg-white rounded-lg shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{task.title}</h2>

      {/* Task Info */}
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-gray-600">
          <User className="w-5 h-5 text-gray-500" />
          <strong className="font-medium">Assigned To:</strong> {task.assignedTo}
        </p>
        <p className="flex items-center gap-2 text-gray-600">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <strong className="font-medium">Deadline:</strong> {task.deadline}
        </p>
        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusClasses(task.status)}`}>
          {task.status}
        </span>
      </div>

      {/* Description */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" /> Description
        </h3>
        <p className="text-gray-700 mt-2">{task.description}</p>
      </div>

      {/* Attachments & Feedback */}
      <div className="mt-6 space-y-4">
        <Attachments files={task.attachments} />
        
        <Feedback taskId={task.id} />
      </div>
    </motion.div>
  );
}

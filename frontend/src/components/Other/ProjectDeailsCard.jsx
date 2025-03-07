import { motion } from "framer-motion";
import { FaTasks, FaFolder, FaCheckCircle, FaCalendarAlt, FaClock } from "react-icons/fa";
import SkeletonCard from "../UI/SkeletonCard";

const ProjectDetailsCard = ({ project, loading }) => {
  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.h2
        className="mb-6 text-4xl font-extrabold text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaTasks className="inline-block mr-2 text-blue-600" />
        {project?.title || "Project Details"}
      </motion.h2>

      <motion.div
        className="p-8 bg-white shadow-xl rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <p className="mb-4 text-xl text-gray-800">{project?.description}</p>

        <div className="mt-6 space-y-4 text-gray-700">
          <p className="flex items-center gap-3">
            <FaFolder className="text-blue-600" />
            <strong>Category:</strong> {project?.category}
          </p>
          <p className="flex items-center gap-3">
            <FaCheckCircle className="text-green-600" />
            <strong>Status:</strong> {project?.status}
          </p>
          <p className="flex items-center gap-3">
            <FaCalendarAlt className="text-purple-600" />
            <strong>Start Date:</strong> {project?.startDate}
          </p>
          <p className="flex items-center gap-3">
            <FaClock className="text-red-600" />
            <strong>End Date:</strong> {project?.endDate}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetailsCard;

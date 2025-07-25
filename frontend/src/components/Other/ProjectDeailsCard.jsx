import { motion } from "framer-motion";
import { FaTasks, FaFolder, FaCheckCircle, FaCalendarAlt, FaClock } from "react-icons/fa";
import SkeletonCard from "../UI/SkeletonCard";

const ProjectDetailsCard = ({ project, loading }) => {
  if (loading) {
    return <SkeletonCard />;
  }

  // --- Robust Date Formatter from ProjectCard ---
  const formatDate = (dateInput) => {
    try {
      let date;

      if (!dateInput) return "Not set";

      if (typeof dateInput === 'string') {
        // Handle ISO string/date-like strings
        if (dateInput.includes('T') || dateInput.includes('-')) {
          date = new Date(dateInput);
        } else {
          // String seems to be a timestamp (seconds or ms)
          const timestamp = parseInt(dateInput);
          date = new Date(timestamp);
        }
      } else if (typeof dateInput === 'number') {
        // Handle Unix timestamp (convert seconds if necessary)
        const timestamp = dateInput.toString().length === 10 ? dateInput * 1000 : dateInput;
        date = new Date(timestamp);
      } else {
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) return "Not set";

      // Format as DD/MM/YYYY
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return "Not set";
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-brand-accent-600 bg-brand-accent-50 dark:text-brand-accent-400 dark:bg-brand-accent-900/20';
      case 'in progress':
        return 'text-brand-primary-600 bg-brand-primary-50 dark:text-brand-primary-400 dark:bg-brand-primary-900/20';
      case 'pending':
        return 'text-warning bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
      default:
        return 'text-txt-secondary-light dark:text-txt-secondary-dark bg-bg-accent-light dark:bg-bg-accent-dark';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
            <FaTasks className="text-white text-lg" />
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
            {project?.title || "Project Details"}
          </h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full"></div>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/30 dark:border-gray-700/30 shadow-xl backdrop-blur-sm rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {/* Card Header */}
        <div className="p-8 bg-gradient-to-r from-bg-secondary-light to-bg-accent-light dark:from-bg-secondary-dark dark:to-bg-accent-dark border-b border-gray-200/20 dark:border-gray-700/20">
          <p className="font-body text-lg leading-relaxed text-txt-primary-light dark:text-txt-primary-dark">
            {project?.description || "No description available"}
          </p>
        </div>

        {/* Card Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <motion.div
              className="flex items-center gap-4 p-4 rounded-2xl bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 dark:from-brand-secondary-900/30 dark:to-brand-secondary-800/30 rounded-xl flex items-center justify-center">
                <FaFolder className="text-brand-secondary-600 dark:text-brand-secondary-400 text-lg" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  Category
                </p>
                <p className="font-heading text-lg font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  {project?.category || "Not specified"}
                </p>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              className="flex items-center gap-4 p-4 rounded-2xl bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-accent-100 to-brand-accent-200 dark:from-brand-accent-900/30 dark:to-brand-accent-800/30 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-brand-accent-600 dark:text-brand-accent-400 text-lg" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  Status
                </p>
                <span className={`font-heading text-lg font-semibold px-3 py-1 rounded-full text-sm ${getStatusColor(project?.status)}`}>
                  {project?.status || "Unknown"}
                </span>
              </div>
            </motion.div>

            {/* Start Date */}
            <motion.div
              className="flex items-center gap-4 p-4 rounded-2xl bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-brand-primary-600 dark:text-brand-primary-400 text-lg" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  Start Date
                </p>
                <p className="font-heading text-lg font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  {formatDate(project?.startDate)}
                </p>
              </div>
            </motion.div>

            {/* End Date */}
            <motion.div
              className="flex items-center gap-4 p-4 rounded-2xl bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl flex items-center justify-center">
                <FaClock className="text-red-600 dark:text-red-400 text-lg" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  End Date
                </p>
                <p className="font-heading text-lg font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  {formatDate(project?.endDate)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar (if project has progress data) */}
        {project?.progress !== undefined && (
          <motion.div
            className="px-8 pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  Progress
                </p>
                <span className="font-heading text-lg font-bold text-heading-accent-light dark:text-heading-accent-dark">
                  {project.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-brand-primary-500 to-brand-accent-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectDetailsCard;

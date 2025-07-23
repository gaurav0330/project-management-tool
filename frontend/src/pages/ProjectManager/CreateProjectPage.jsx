import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CREATE_PROJECT_MUTATION } from "../../graphql/maneger/createProject";
import { Alert, Snackbar } from "@mui/material";
import { motion } from "framer-motion";

function CreateProject({ onClose }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    selectedCategory: "",
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [createProject, { loading }] = useMutation(CREATE_PROJECT_MUTATION);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validate individual fields in real-time
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'projectName':
        if (!value.trim()) {
          newErrors.projectName = "Project name is required";
        } else if (value.trim().length < 3) {
          newErrors.projectName = "Project name must be at least 3 characters";
        } else if (value.trim().length > 100) {
          newErrors.projectName = "Project name must be less than 100 characters";
        } else {
          delete newErrors.projectName;
        }
        break;

      case 'projectDescription':
        if (!value.trim()) {
          newErrors.projectDescription = "Description is required";
        } else if (value.trim().length < 10) {
          newErrors.projectDescription = "Description must be at least 10 characters";
        } else if (value.trim().length > 500) {
          newErrors.projectDescription = "Description must be less than 500 characters";
        } else {
          delete newErrors.projectDescription;
        }
        break;

      case 'startDate':
        const today = getTodayDate();
        if (!value) {
          newErrors.startDate = "Start date is required";
        } else if (value < today) {
          newErrors.startDate = "Start date cannot be in the past";
        } else {
          delete newErrors.startDate;
          // Also validate end date if it exists
          if (formData.endDate && value > formData.endDate) {
            newErrors.endDate = "End date must be after start date";
          } else if (formData.endDate && value <= formData.endDate) {
            delete newErrors.endDate;
          }
        }
        break;

      case 'endDate':
        if (!value) {
          newErrors.endDate = "End date is required";
        } else if (formData.startDate && value <= formData.startDate) {
          newErrors.endDate = "End date must be after start date";
        } else if (value < getTodayDate()) {
          newErrors.endDate = "End date cannot be in the past";
        } else {
          // Check if project duration is reasonable (not more than 5 years)
          const startDate = new Date(formData.startDate);
          const endDate = new Date(value);
          const diffInYears = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
          
          if (diffInYears > 5) {
            newErrors.endDate = "Project duration cannot exceed 5 years";
          } else {
            delete newErrors.endDate;
          }
        }
        break;

      case 'selectedCategory':
        if (!value) {
          newErrors.selectedCategory = "Please select a category";
        } else {
          delete newErrors.selectedCategory;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Real-time validation on input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    
    // Validate the current field
    validateField(name, value);
  };

  // Comprehensive form validation before submission
  const validateForm = () => {
    const newErrors = {};
    const today = getTodayDate();

    // Project Name validation
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    } else if (formData.projectName.trim().length < 3) {
      newErrors.projectName = "Project name must be at least 3 characters";
    } else if (formData.projectName.trim().length > 100) {
      newErrors.projectName = "Project name must be less than 100 characters";
    }

    // Description validation
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Description is required";
    } else if (formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = "Description must be at least 10 characters";
    } else if (formData.projectDescription.trim().length > 500) {
      newErrors.projectDescription = "Description must be less than 500 characters";
    }

    // Start Date validation
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (formData.startDate < today) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    // End Date validation
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.endDate < today) {
      newErrors.endDate = "End date cannot be in the past";
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = "End date must be after start date";
    } else if (formData.startDate) {
      // Check project duration
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const diffInYears = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
      
      if (diffInYears > 5) {
        newErrors.endDate = "Project duration cannot exceed 5 years";
      }
    }

    // Category validation
    if (!formData.selectedCategory) {
      newErrors.selectedCategory = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = async () => {
    if (!validateForm()) {
      setSnackbarMessage("Please fix all validation errors before submitting");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const { data } = await createProject({
        variables: {
          title: formData.projectName.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          category: formData.selectedCategory,
          description: formData.projectDescription.trim(),
        },
      });

      if (data?.createProject?.id) {
        setSnackbarMessage("Project created successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate(`/assignLead/${data.createProject.id}`), 1800);
      }
    } catch (err) {
      setSnackbarMessage("Error creating project. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("GraphQL error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-bg-secondary-light dark:bg-bg-secondary-dark"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="section-container bg-bg-primary-light dark:bg-bg-primary-dark p-8 lg:p-12 shadow-xl rounded-3xl"
      >
        {/* Heading + Cancel Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-heading-primary-light dark:text-heading-primary-dark text-3xl font-heading font-bold">
            🛠️ Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="space-y-6 font-body">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              name="projectName"
              type="text"
              placeholder="Enter project name (3-100 characters)"
              value={formData.projectName}
              onChange={handleInput}
              maxLength={100}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                errors.projectName 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:border-brand-primary-500'
              } bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20`}
            />
            {errors.projectName && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.projectName}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.projectName.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark mb-1">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="projectDescription"
              rows="4"
              placeholder="Describe your project in detail (10-500 characters)..."
              value={formData.projectDescription}
              onChange={handleInput}
              maxLength={500}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                errors.projectDescription 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:border-brand-primary-500'
              } bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20`}
            />
            {errors.projectDescription && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.projectDescription}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.projectDescription.length}/500 characters
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInput}
                  min={getTodayDate()}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.startDate 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:border-brand-primary-500'
                  } bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20`}
                />
              </div>
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInput}
                  min={formData.startDate || getTodayDate()}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.endDate 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:border-brand-primary-500'
                  } bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20`}
                />
              </div>
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark mb-1">
              Project Category <span className="text-red-500">*</span>
            </label>
            <select
              name="selectedCategory"
              value={formData.selectedCategory}
              onChange={handleInput}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                errors.selectedCategory 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:border-brand-primary-500'
              } bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20`}
            >
              <option value="">Select a category</option>
              <option value="marketing">📈 Marketing</option>
              <option value="development">💻 Development</option>
              <option value="design">🎨 Design</option>
              <option value="research">🔬 Research</option>
              <option value="operations">⚙️ Operations</option>
            </select>
            {errors.selectedCategory && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.selectedCategory}
              </p>
            )}
          </div>

          {/* Final Create Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || Object.keys(errors).length > 0}
            onClick={handleCreateProject}
            className={`w-full mt-8 py-3 px-6 font-button text-white rounded-xl shadow-lg transition-all ${
              loading || Object.keys(errors).length > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Project...
              </span>
            ) : (
              "🚀 Create Project"
            )}
          </motion.button>
        </div>
      </motion.div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

export default CreateProject;

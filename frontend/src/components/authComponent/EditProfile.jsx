import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { User, Calendar, Star, Target, Code, Briefcase, Award, TrendingUp, XIcon, Edit2, Save, X, Activity, Clock, AlertTriangle, RefreshCw, Plus, UserPlus } from 'lucide-react';

const GET_PROFILE = gql`
  query GetProfile($userId: ID!) {
    getProfile(userId: $userId) {
      id
      GithubUsername
      skills {
        name
        proficiency
        experienceYears
        lastUsed
        certifications
      }
      availability
      workload
      workloadDetails {
        totalTasks
        activeTasks
        completedTasks
        overdueTasks
        highPriorityTasks
        workloadPercentage
        tasksByStatus {
          status
          count
        }
      }
      preferredRoles
      experience {
        totalYears
        currentLevel
        projectsCompleted
        projectExperience {
          projectType
          domain
          role
          duration
          technologies
          completedAt
        }
      }
      preferences {
        projectTypes
        domains
      }
      performance {
        completionRate
        averageRating
        totalRatings
        collaborationScore
        onTimeDeliveryRate
        tasksCompletedThisMonth
        averageTaskDuration
        qualityScore
        productivityScore
        recentPerformanceTrend
      }
      learningGoals
      createdAt
      updatedAt
      user {
        username
        email
        role
      }
    }
  }
`;

const CREATE_PROFILE = gql`
  mutation CreateProfile($userId: ID!, $skills: [SkillInput!]!, $GithubUsername: String!) {
    createProfile(userId: $userId, skills: $skills, GithubUsername: $GithubUsername) {
      id
      GithubUsername
      availability
      workload
      preferredRoles
      learningGoals
      createdAt
      updatedAt
    }
  }
`;


const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $userId: ID!
    $availability: Availability
    $skills: [SkillInput!]
    $GithubUsername: String
    $preferredRoles: [PreferredRole!]
    $preferences: PreferencesInput
    $learningGoals: [String!]
  ) {
    updateProfile(
      userId: $userId
      availability: $availability
      skills: $skills
      GithubUsername: $GithubUsername
      preferredRoles: $preferredRoles
      preferences: $preferences
      learningGoals: $learningGoals
    ) {
      id
      GithubUsername
      skills { name proficiency experienceYears certifications }
      availability
      workload
      workloadDetails {
        totalTasks
        activeTasks
        completedTasks
        overdueTasks
        highPriorityTasks
        workloadPercentage
        tasksByStatus {
          status
          count
        }
      }
      preferredRoles
      preferences {
        projectTypes
        domains
      }
      learningGoals
      performance {
        completionRate
        averageRating
        totalRatings
        collaborationScore
        onTimeDeliveryRate
        tasksCompletedThisMonth
        averageTaskDuration
        qualityScore
        productivityScore
        recentPerformanceTrend
      }
    }
  }
`;

const UPDATE_EXPERIENCE = gql`
  mutation UpdateExperience(
    $userId: ID!
    $totalYears: Int
    $currentLevel: ExperienceLevel
    $projectsCompleted: Int
  ) {
    updateExperience(
      userId: $userId
      totalYears: $totalYears
      currentLevel: $currentLevel
      projectsCompleted: $projectsCompleted
    ) {
      id
      experience {
        totalYears
        currentLevel
        projectsCompleted
      }
    }
  }
`;

const REFRESH_WORKLOAD = gql`
  mutation RefreshUserWorkload($userId: ID!) {
    refreshUserWorkload(userId: $userId) {
      id
      workload
      availability
      workloadDetails {
        totalTasks
        activeTasks
        completedTasks
        overdueTasks
        highPriorityTasks
        workloadPercentage
        tasksByStatus {
          status
          count
        }
      }
    }
  }
`;

const REFRESH_PERFORMANCE = gql`
  mutation RefreshUserPerformance($userId: ID!) {
    refreshUserPerformance(userId: $userId) {
      id
      performance {
        completionRate
        averageRating
        totalRatings
        collaborationScore
        onTimeDeliveryRate
        tasksCompletedThisMonth
        averageTaskDuration
        qualityScore
        productivityScore
        recentPerformanceTrend
      }
    }
  }
`;

const availabilityOptions = ["available", "busy", "offline"];
const proficiencyOptions = ["beginner", "intermediate", "advanced"];
const preferredRoleOptions = ["frontend", "backend", "fullstack", "mobile", "devops", "ui_ux", "testing", "database"];
const experienceLevelOptions = ["junior", "mid", "senior", "lead"];

const ProfileDisplay = ({ userId, onClose, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [newCertification, setNewCertification] = useState("");
  const [newProjectType, setNewProjectType] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newLearningGoal, setNewLearningGoal] = useState("");

  // States for create profile form
  const [createProfileData, setCreateProfileData] = useState({
    GithubUsername: "",
    skills: [],
    availability: "available",
    preferredRoles: [],
    learningGoals: [],
    preferences: {
      projectTypes: [],
      domains: []
    }
  });

  const { loading, error, data, refetch } = useQuery(GET_PROFILE, {
    variables: { userId },
    pollInterval: 30000,
    errorPolicy: 'all'
  });

  const [createProfile, { loading: creating }] = useMutation(CREATE_PROFILE, {
    onCompleted(data) {
      setIsCreating(false);
      if (onUpdated) onUpdated(data.createProfile);
      refetch();
    },
    onError(error) {
      console.error("Create profile error:", error);
    }
  });

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE, {
    onCompleted(data) {
      setIsEditing(false);
      if (onUpdated) onUpdated(data.updateProfile);
      refetch();
    },
  });

  const [updateExperience, { loading: updatingExp }] = useMutation(UPDATE_EXPERIENCE, {
    onCompleted() {
      refetch();
    },
  });

  const [refreshWorkload, { loading: refreshingWorkload }] = useMutation(REFRESH_WORKLOAD, {
    onCompleted() {
      refetch();
    },
  });

  const [refreshPerformance, { loading: refreshingPerformance }] = useMutation(REFRESH_PERFORMANCE, {
    onCompleted() {
      refetch();
    },
  });

  useEffect(() => {
    if (data?.getProfile) {
      setEditedProfile({
        GithubUsername: data.getProfile.GithubUsername,
        availability: data.getProfile.availability,
        skills: data.getProfile.skills || [],
        preferredRoles: data.getProfile.preferredRoles || [],
        preferences: {
          projectTypes: data.getProfile.preferences?.projectTypes || [],
          domains: data.getProfile.preferences?.domains || []
        },
        learningGoals: data.getProfile.learningGoals || [],
        experience: data.getProfile.experience || { totalYears: 0, currentLevel: 'junior', projectsCompleted: 0 }
      });
    }
  }, [data]);

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );

  // Check if profile doesn't exist
  const profileNotFound = error?.message?.includes('Profile not found') || 
                          error?.message?.includes('not found') || 
                          (!loading && !data?.getProfile);

  if (error && !profileNotFound) return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
          Error loading profile: {error.message}
        </div>
      </div>
    </div>
  );

  // Helper functions for colors and formatting
  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'busy': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400';
    }
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 80) return 'text-red-600 dark:text-red-400';
    if (workload >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'beginner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'intermediate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'advanced': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'junior': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'mid': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'senior': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'lead': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'declining': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'stable': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Create Profile Handlers
const handleCreateProfile = () => {
  const validSkills = createProfileData.skills.filter(s => s.name.trim() !== "").map(skill => ({
    name: skill.name.trim(),
    proficiency: skill.proficiency || 'beginner',
    experienceYears: parseInt(skill.experienceYears) || 0,
    certifications: Array.isArray(skill.certifications) ? skill.certifications : []
  }));

  // Ensure we always have at least one skill and a GitHub username
  const skillsToSend = validSkills.length > 0 ? validSkills : [{
    name: "JavaScript", // Default skill
    proficiency: "beginner",
    experienceYears: 0,
    certifications: []
  }];

  const githubUsername = createProfileData.GithubUsername.trim() || "defaultuser";

  createProfile({
    variables: {
      userId,
      skills: skillsToSend,
      GithubUsername: githubUsername,
    },
  });
};


  // Create profile form handlers
  const addCreateSkill = () => {
    setCreateProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: "", proficiency: "beginner", experienceYears: 0, certifications: [] }]
    }));
  };

  const removeCreateSkill = (index) => {
    setCreateProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleCreateSkillChange = (index, field, value) => {
    const newSkills = [...createProfileData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setCreateProfileData(prev => ({ ...prev, skills: newSkills }));
  };

  // Edit handlers
  const handleSkillChange = (index, field, value) => {
    const newSkills = [...editedProfile.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setEditedProfile(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setEditedProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { name: "", proficiency: "beginner", experienceYears: 0, certifications: [] }]
    }));
  };

  const removeSkill = (index) => {
    if (editedProfile.skills.length > 0) {
      setEditedProfile(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    }
  };

  const addCertification = (skillIndex) => {
    if (newCertification.trim()) {
      const newSkills = [...editedProfile.skills];
      newSkills[skillIndex].certifications = [...(newSkills[skillIndex].certifications || []), newCertification];
      setEditedProfile(prev => ({ ...prev, skills: newSkills }));
      setNewCertification("");
    }
  };

  const removeCertification = (skillIndex, certIndex) => {
    const newSkills = [...editedProfile.skills];
    newSkills[skillIndex].certifications = newSkills[skillIndex].certifications.filter((_, i) => i !== certIndex);
    setEditedProfile(prev => ({ ...prev, skills: newSkills }));
  };

  const handlePreferredRoleChange = (role) => {
    setEditedProfile(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter(r => r !== role)
        : [...prev.preferredRoles, role]
    }));
  };

  const addProjectType = () => {
    if (newProjectType.trim() && !editedProfile.preferences.projectTypes.includes(newProjectType)) {
      setEditedProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          projectTypes: [...prev.preferences.projectTypes, newProjectType]
        }
      }));
      setNewProjectType("");
    }
  };

  const removeProjectType = (type) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        projectTypes: prev.preferences.projectTypes.filter(t => t !== type)
      }
    }));
  };

  const addDomain = () => {
    if (newDomain.trim() && !editedProfile.preferences.domains.includes(newDomain)) {
      setEditedProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          domains: [...prev.preferences.domains, newDomain]
        }
      }));
      setNewDomain("");
    }
  };

  const removeDomain = (domain) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        domains: prev.preferences.domains.filter(d => d !== domain)
      }
    }));
  };

  const addLearningGoal = () => {
    if (newLearningGoal.trim() && !editedProfile.learningGoals.includes(newLearningGoal)) {
      setEditedProfile(prev => ({
        ...prev,
        learningGoals: [...prev.learningGoals, newLearningGoal]
      }));
      setNewLearningGoal("");
    }
  };

  const removeLearningGoal = (goal) => {
    setEditedProfile(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.filter(g => g !== goal)
    }));
  };

  const handleSave = () => {
    const validSkills = editedProfile.skills.filter(s => s.name.trim() !== "").map(({ __typename, lastUsed, _id, ...rest }) => ({
      name: rest.name.trim(),
      proficiency: rest.proficiency || 'beginner',
      experienceYears: parseInt(rest.experienceYears) || 0,
      certifications: Array.isArray(rest.certifications) ? rest.certifications : []
    }));

    updateProfile({
      variables: {
        userId,
        availability: editedProfile.availability,
        skills: validSkills,
        GithubUsername: editedProfile.GithubUsername,
        preferredRoles: editedProfile.preferredRoles,
        preferences: {
          projectTypes: editedProfile.preferences?.projectTypes || [],
          domains: editedProfile.preferences?.domains || []
        },
        learningGoals: editedProfile.learningGoals,
      },
    });
  };

  const handleSaveExperience = () => {
    updateExperience({
      variables: {
        userId,
        totalYears: parseInt(editedProfile.experience.totalYears, 10),
        currentLevel: editedProfile.experience.currentLevel,
        projectsCompleted: parseInt(editedProfile.experience.projectsCompleted, 10),
      },
    });
  };

  const handleRefreshWorkload = () => {
    refreshWorkload({
      variables: { userId }
    });
  };

  const handleRefreshPerformance = () => {
    refreshPerformance({
      variables: { userId }
    });
  };

  // Render Create Profile Form
  if (profileNotFound && !isCreating) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 w-full max-w-2xl mx-4 rounded-2xl shadow-2xl relative overflow-hidden border border-gray-200 dark:border-slate-700">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Create Your Profile</h1>
                  <p className="text-blue-100">Set up your professional profile to get started</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                <XIcon size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gray-500 dark:text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Profile Found
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                It looks like you haven't created a profile yet. Create one now to showcase your skills and experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Profile
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Create Profile Form
  if (isCreating) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center" onClick={() => setIsCreating(false)}>
        <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 w-full max-w-4xl mx-4 rounded-2xl shadow-2xl relative overflow-hidden max-h-[90vh] border border-gray-200 dark:border-slate-700">
          
          {/* Header */}
          <div className="sticky top-0 z-[60] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 p-6 flex justify-between items-center rounded-t-2xl shadow-sm">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Profile
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateProfile}
                disabled={creating}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
              >
                <Save className="w-4 h-4 inline mr-2" />
                {creating ? 'Creating...' : 'Create Profile'}
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors duration-200"
              >
                <XIcon size={22} />
              </button>
            </div>
          </div>

          {/* Create Form Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={createProfileData.GithubUsername}
                    onChange={(e) => setCreateProfileData(prev => ({ ...prev, GithubUsername: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your GitHub username"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-600" />
                Skills
              </h3>
              <div className="space-y-4">
                {createProfileData.skills.map((skill, index) => (
                  <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Skill Name</label>
                        <input
                          type="text"
                          placeholder="e.g., JavaScript, React, Node.js"
                          value={skill.name}
                          onChange={(e) => handleCreateSkillChange(index, "name", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Proficiency Level</label>
                        <select
                          value={skill.proficiency}
                          onChange={(e) => handleCreateSkillChange(index, "proficiency", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                          {proficiencyOptions.map(level => (
                            <option key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Years of Experience</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={skill.experienceYears || 0}
                          onChange={(e) => handleCreateSkillChange(index, "experienceYears", parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCreateSkill(index)}
                      className="mt-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      Remove Skill
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addCreateSkill} 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  + Add New Skill
                </button>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 text-center border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Ready to Create Your Profile?
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                You can add more details like experience, preferences, and learning goals after creating your profile.
              </p>
              <button
                onClick={handleCreateProfile}
                disabled={creating}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
              >
                {creating ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rest of the existing ProfileDisplay component code (when profile exists)
  const profile = data.getProfile;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 w-full max-w-6xl mx-4 rounded-2xl shadow-2xl relative overflow-hidden max-h-[90vh] border border-gray-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="sticky top-0 z-[60] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 p-6 flex justify-between items-center rounded-t-2xl shadow-sm">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile Details</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                isEditing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 inline mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 inline mr-2" />
                  Edit
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={updating}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
              >
                <Save className="w-4 h-4 inline mr-2" />
                {updating ? 'Saving...' : 'Save'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors duration-200"
            >
              <XIcon size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable content with the full profile display */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] relative z-10">
          <div className="p-6 space-y-6">
            
            {/* Header Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {profile.user.username}
                    </h2>
                    <p className="text-gray-600 dark:text-slate-300">{profile.user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Role: {profile.user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Availability</label>
                        <select
                          value={editedProfile.availability}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, availability: e.target.value }))}
                          className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                          {availabilityOptions.map(option => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className={`px-3 py-1 rounded-xl text-sm font-medium ${getAvailabilityColor(profile.availability)}`}>
                        {profile.availability}
                      </span>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${getWorkloadColor(profile.workload)}`}>
                          Workload: {profile.workload}%
                        </p>
                        <button
                          onClick={handleRefreshWorkload}
                          disabled={refreshingWorkload}
                          className="text-xs px-2 py-1 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all transform hover:scale-105 relative z-20"
                          title="Refresh workload from tasks"
                        >
                          {refreshingWorkload ? '...' : '↻'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  {isEditing ? (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">GitHub Username</label>
                      <input
                        type="text"
                        value={editedProfile.GithubUsername}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, GithubUsername: e.target.value }))}
                        className="text-sm border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="GitHub Username"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-slate-300">
                      GitHub: @{profile.GithubUsername}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span className="text-sm text-gray-700 dark:text-slate-300">
                    Joined: {formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-600" />
                Skills & Expertise
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="space-y-4">
                  {isEditing ? (
                    editedProfile.skills.map((skill, index) => (
                      <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Skill Name</label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Proficiency</label>
                            <select
                              value={skill.proficiency}
                              onChange={(e) => handleSkillChange(index, "proficiency", e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                              {proficiencyOptions.map(level => (
                                <option key={level} value={level}>
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Experience (Years)</label>
                            <input
                              type="number"
                              value={skill.experienceYears || 0}
                              onChange={(e) => handleSkillChange(index, "experienceYears", parseInt(e.target.value) || 0)}
                              min="0"
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Certifications */}
                        <div className="mt-4">
                          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-2">Certifications</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {skill.certifications && skill.certifications.map((cert, certIndex) => (
                              <span
                                key={certIndex}
                                className="inline-flex items-center px-3 py-1 rounded-lg text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {cert}
                                <button
                                  onClick={() => removeCertification(index, certIndex)}
                                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add certification"
                              value={newCertification}
                              onChange={(e) => setNewCertification(e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <button
                              onClick={() => addCertification(index)}
                              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeSkill(index)}
                          className="mt-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          Remove Skill
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.skills.map((skill, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-600 shadow-md">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{skill.name}</h4>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                              {skill.proficiency}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                            {skill.experienceYears} years experience
                          </p>
                          {skill.certifications && skill.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {skill.certifications.map((cert, certIndex) => (
                                <span
                                  key={certIndex}
                                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {isEditing && (
                    <button onClick={addSkill} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                      + Add New Skill
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-slate-400">No skills listed yet</p>
              )}
            </div>

            {/* Workload Details */}
            {profile.workloadDetails && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Current Workload
                  <button
                    onClick={handleRefreshWorkload}
                    disabled={refreshingWorkload}
                    className="ml-2 p-1 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all transform hover:scale-105"
                    title="Refresh workload data"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshingWorkload ? 'animate-spin' : ''}`} />
                  </button>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {profile.workloadDetails.totalTasks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {profile.workloadDetails.activeTasks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {profile.workloadDetails.completedTasks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {profile.workloadDetails.overdueTasks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Overdue</div>
                  </div>
                </div>
                {profile.workloadDetails.highPriorityTasks > 0 && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                      <span className="text-sm text-red-800 dark:text-red-200 font-medium">
                        {profile.workloadDetails.highPriorityTasks} high priority tasks need attention
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience Section */}
            {profile.experience && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                  Experience
                  {isEditing && (
                    <button
                      onClick={handleSaveExperience}
                      disabled={updatingExp}
                      className="ml-2 px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {updatingExp ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    {isEditing ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Total Years</label>
                        <input
                          type="number"
                          value={editedProfile.experience.totalYears}
                          onChange={(e) => setEditedProfile(prev => ({ 
                            ...prev, 
                            experience: { ...prev.experience, totalYears: e.target.value } 
                          }))}
                          className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {profile.experience.totalYears}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">Years Experience</div>
                      </>
                    )}
                  </div>
                  <div className="text-center">
                    {isEditing ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Current Level</label>
                        <select
                          value={editedProfile.experience.currentLevel}
                          onChange={(e) => setEditedProfile(prev => ({ 
                            ...prev, 
                            experience: { ...prev.experience, currentLevel: e.target.value } 
                          }))}
                          className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        >
                          {experienceLevelOptions.map(level => (
                            <option key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getLevelColor(profile.experience.currentLevel)}`}>
                          {profile.experience.currentLevel}
                        </span>
                        <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">Current Level</div>
                      </>
                    )}
                  </div>
                  <div className="text-center">
                    {isEditing ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Projects Completed</label>
                        <input
                          type="number"
                          value={editedProfile.experience.projectsCompleted}
                          onChange={(e) => setEditedProfile(prev => ({ 
                            ...prev, 
                            experience: { ...prev.experience, projectsCompleted: e.target.value } 
                          }))}
                          className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {profile.experience.projectsCompleted}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">Projects Completed</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Performance Section */}
            {profile.performance && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Performance Metrics
                  <button
                    onClick={handleRefreshPerformance}
                    disabled={refreshingPerformance}
                    className="ml-2 p-1 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all transform hover:scale-105"
                    title="Refresh performance data"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshingPerformance ? 'animate-spin' : ''}`} />
                  </button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {profile.performance.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {profile.performance.averageRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {profile.performance.onTimeDeliveryRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">On-Time Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {profile.performance.tasksCompletedThisMonth}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">Tasks This Month</div>
                  </div>
                </div>
                {profile.performance.recentPerformanceTrend && (
                  <div className="mt-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getTrendColor(profile.performance.recentPerformanceTrend)}`}>
                      Performance: {profile.performance.recentPerformanceTrend}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Preferred Roles */}
            {(profile.preferredRoles && profile.preferredRoles.length > 0) || isEditing ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Preferred Roles
                </h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {preferredRoleOptions.map(role => (
                      <label key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editedProfile.preferredRoles.includes(role)}
                          onChange={() => handlePreferredRoleChange(role)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-slate-300">
                          {role.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredRoles.map(role => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg text-sm font-medium"
                      >
                        {role.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Preferences */}
            {(profile.preferences && (profile.preferences.projectTypes?.length > 0 || profile.preferences.domains?.length > 0)) || isEditing ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-indigo-600" />
                  Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project Types</h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editedProfile.preferences.projectTypes.map(type => (
                            <span
                              key={type}
                              className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                            >
                              {type}
                              <button
                                onClick={() => removeProjectType(type)}
                                className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add project type"
                            value={newProjectType}
                            onChange={(e) => setNewProjectType(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          />
                          <button
                            onClick={addProjectType}
                            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferences.projectTypes?.map(type => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Domains</h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editedProfile.preferences.domains.map(domain => (
                            <span
                              key={domain}
                              className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            >
                              {domain}
                              <button
                                onClick={() => removeDomain(domain)}
                                className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add domain"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                          />
                          <button
                            onClick={addDomain}
                            className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferences.domains?.map(domain => (
                          <span
                            key={domain}
                            className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg text-sm"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Learning Goals */}
            {(profile.learningGoals && profile.learningGoals.length > 0) || isEditing ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-emerald-600" />
                  Learning Goals
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editedProfile.learningGoals.map(goal => (
                        <span
                          key={goal}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                          {goal}
                          <button
                            onClick={() => removeLearningGoal(goal)}
                            className="ml-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add learning goal"
                        value={newLearningGoal}
                        onChange={(e) => setNewLearningGoal(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                      <button
                        onClick={addLearningGoal}
                        className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.learningGoals.map((goal, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-slate-300">{goal}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Profile Stats Footer */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-slate-400">
                <span>Profile created: {formatDate(profile.createdAt)}</span>
                <span>Last updated: {formatDate(profile.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;

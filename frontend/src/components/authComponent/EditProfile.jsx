import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { User, Calendar, Star, Target, Code, Briefcase, Award, TrendingUp, XIcon, Edit2, Save, X, Activity, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

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
  const [editedProfile, setEditedProfile] = useState({});
  const [newCertification, setNewCertification] = useState("");
  const [newProjectType, setNewProjectType] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newLearningGoal, setNewLearningGoal] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_PROFILE, {
    variables: { userId },
    pollInterval: 30000,
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

  if (error) return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
          Error loading profile: {error.message}
        </div>
      </div>
    </div>
  );

  if (!data?.getProfile) return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
          No profile found for this user.
        </div>
      </div>
    </div>
  );

  const profile = data.getProfile;

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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 w-full max-w-6xl mx-4 rounded-2xl shadow-2xl relative overflow-hidden max-h-[90vh] border border-gray-200 dark:border-slate-700">
        
        {/* ✅ FIXED: Header with proper z-index */}
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

        {/* ✅ FIXED: Scrollable content with proper z-index management */}
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

            {/* Workload Details Section */}
            {profile.workloadDetails && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Workload Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-600">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{profile.workloadDetails.totalTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Total Tasks</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-600">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{profile.workloadDetails.activeTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Active</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-600">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{profile.workloadDetails.completedTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-600">
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{profile.workloadDetails.overdueTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">Overdue</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-600">
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{profile.workloadDetails.highPriorityTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">High Priority</p>
                  </div>
                </div>
                
                {profile.workloadDetails.tasksByStatus.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-slate-200 mb-2">Tasks by Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.workloadDetails.tasksByStatus.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-xl font-medium">
                          {item.status}: {item.count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Experience Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-emerald-600" />
                    Experience
                  </h3>
                  {isEditing && (
                    <button
                      onClick={handleSaveExperience}
                      disabled={updatingExp}
                      className="px-3 py-1 text-xs font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 relative z-20"
                    >
                      {updatingExp ? 'Saving...' : 'Save Exp'}
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-600">
                      {isEditing ? (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Total Years</label>
                          <input
                            type="number"
                            value={editedProfile.experience?.totalYears || 0}
                            onChange={(e) => setEditedProfile(prev => ({
                              ...prev,
                              experience: { ...prev.experience, totalYears: e.target.value }
                            }))}
                            className="text-2xl font-bold text-blue-600 dark:text-blue-400 w-full text-center border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            min="0"
                          />
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.experience.totalYears}</p>
                      )}
                      <p className="text-xs text-gray-600 dark:text-slate-400">Years Experience</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-600">
                      {isEditing ? (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Projects</label>
                          <input
                            type="number"
                            value={editedProfile.experience?.projectsCompleted || 0}
                            onChange={(e) => setEditedProfile(prev => ({
                              ...prev,
                              experience: { ...prev.experience, projectsCompleted: e.target.value }
                            }))}
                            className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 w-full text-center border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            min="0"
                          />
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{profile.experience.projectsCompleted}</p>
                      )}
                      <p className="text-xs text-gray-600 dark:text-slate-400">Projects Completed</p>
                    </div>
                  </div>
                  <div className="text-center">
                    {isEditing ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Experience Level</label>
                        <select
                          value={editedProfile.experience?.currentLevel || 'junior'}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            experience: { ...prev.experience, currentLevel: e.target.value }
                          }))}
                          className="px-3 py-2 rounded-xl text-sm font-medium border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        >
                          {experienceLevelOptions.map(level => (
                            <option key={level} value={level}>
                              {level.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getLevelColor(profile.experience.currentLevel)}`}>
                        {profile.experience.currentLevel.toUpperCase()} LEVEL
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Performance Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Performance
                  </h3>
                  <button
                    onClick={handleRefreshPerformance}
                    disabled={refreshingPerformance}
                    className="text-xs px-2 py-1 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all transform hover:scale-105 relative z-20"
                    title="Refresh performance metrics"
                  >
                    {refreshingPerformance ? <RefreshCw className="w-3 h-3 animate-spin" /> : '↻'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-slate-300">Completion Rate</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">{profile.performance.completionRate}%</span>
                        {profile.performance.recentPerformanceTrend && (
                          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getTrendColor(profile.performance.recentPerformanceTrend)}`}>
                            {profile.performance.recentPerformanceTrend}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-slate-300">On-Time Delivery</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {profile.performance.onTimeDeliveryRate || 100}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-slate-300">Average Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="font-semibold text-gray-900 dark:text-white">{profile.performance.averageRating}/5</span>
                      <span className="text-gray-500 dark:text-slate-400 ml-1">
                        ({profile.performance.totalRatings} {profile.performance.totalRatings === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-slate-300">Collaboration Score</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="font-semibold text-gray-900 dark:text-white">{profile.performance.collaborationScore}/5</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-slate-600">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-slate-400">This Month</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {profile.performance.tasksCompletedThisMonth || 0}
                      </p>
                      <p className="text-xs text-gray-500">Tasks Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-slate-400">Quality Score</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {profile.performance.qualityScore || 100}%
                      </p>
                      <p className="text-xs text-gray-500">Task Quality</p>
                    </div>
                  </div>

                  {profile.performance.productivityScore && (
                    <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-slate-300">Productivity Score</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {profile.performance.productivityScore}%
                        </span>
                      </div>
                      {profile.performance.averageTaskDuration && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-700 dark:text-slate-300">Avg Task Duration</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {profile.performance.averageTaskDuration.toFixed(1)} days
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-indigo-600" />
                Skills
              </h3>
              <div className="space-y-4">
                {(isEditing ? editedProfile.skills : profile.skills)?.map((skill, index) => (
                  <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 shadow-md">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Skill Name</label>
                            <input
                              type="text"
                              placeholder="e.g., JavaScript, React, Node.js"
                              value={skill.name}
                              onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Proficiency Level</label>
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
                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Years of Experience</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={skill.experienceYears || 0}
                              onChange={(e) => handleSkillChange(index, "experienceYears", parseInt(e.target.value) || 0)}
                              min="0"
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                        
                        {/* Certifications */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Certifications</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="e.g., AWS Certified Developer, Google Cloud Professional"
                              value={newCertification}
                              onChange={(e) => setNewCertification(e.target.value)}
                              className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => addCertification(index)}
                              className="px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 whitespace-nowrap relative z-20"
                            >
                              Add Certification
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(skill.certifications || []).map((cert, certIndex) => (
                              <span key={certIndex} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-xl text-sm flex items-center gap-2 font-medium">
                                {cert}
                                <button
                                  type="button"
                                  onClick={() => removeCertification(index, certIndex)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          Remove Skill
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{skill.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-3 py-1 rounded-xl text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                                {skill.proficiency}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                {skill.experienceYears} years
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-slate-500">
                            Last used: {formatDate(skill.lastUsed)}
                          </span>
                        </div>
                        {skill.certifications?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Certifications:</p>
                            <div className="flex flex-wrap gap-1">
                              {skill.certifications.map((cert, certIndex) => (
                                <span key={certIndex} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-xl font-medium">
                                  <Award className="w-3 h-3 inline mr-1" />
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={addSkill} 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors relative z-20"
                  >
                    + Add New Skill
                  </button>
                )}
              </div>
            </div>

            {/* Preferred Roles */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferred Roles</h3>
              {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {preferredRoleOptions.map(role => (
                    <label key={role} className="flex items-center text-gray-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <input
                        type="checkbox"
                        checked={editedProfile.preferredRoles?.includes(role) || false}
                        onChange={() => handlePreferredRoleChange(role)}
                        className="mr-3 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded"
                      />
                      {role.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.preferredRoles?.map((role, index) => (
                    <span key={index} className="px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl text-sm font-medium">
                      {role.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project Experience - Read Only */}
            {profile.experience.projectExperience?.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Experience</h3>
                <div className="space-y-4">
                  {profile.experience.projectExperience.map((project, index) => (
                    <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{project.projectType}</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {project.domain} • {project.role} • {project.duration} months
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-slate-500">
                          {formatDate(project.completedAt)}
                        </span>
                      </div>
                      {project.technologies?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Technologies:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-lg">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences & Learning Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preferences */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  {/* Project Types */}
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-slate-300 mb-2">Project Types</h4>
                    {isEditing ? (
                      <div>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="e.g., web-development, mobile-app, api-development"
                            value={newProjectType}
                            onChange={(e) => setNewProjectType(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                          />
                          <button 
                            type="button" 
                            onClick={addProjectType} 
                            className="px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 whitespace-nowrap relative z-20"
                          >
                            Add Type
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editedProfile.preferences?.projectTypes?.map(type => (
                            <span key={type} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-xl text-sm flex items-center gap-2 font-medium">
                              {type}
                              <button type="button" onClick={() => removeProjectType(type)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferences?.projectTypes?.map((type, index) => (
                          <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm rounded-xl font-medium">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Domains */}
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-slate-300 mb-2">Domains</h4>
                    {isEditing ? (
                      <div>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="e.g., e-commerce, healthcare, fintech, education"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                          />
                          <button 
                            type="button" 
                            onClick={addDomain} 
                            className="px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 whitespace-nowrap relative z-20"
                          >
                            Add Domain
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editedProfile.preferences?.domains?.map(domain => (
                            <span key={domain} className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-xl text-sm flex items-center gap-2 font-medium">
                              {domain}
                              <button type="button" onClick={() => removeDomain(domain)} className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferences?.domains?.map((domain, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-sm rounded-xl font-medium">
                            {domain}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Goals */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-amber-600" />
                  Learning Goals
                </h3>
                {isEditing ? (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g., React Native, Machine Learning, DevOps"
                        value={newLearningGoal}
                        onChange={(e) => setNewLearningGoal(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={addLearningGoal} 
                        className="px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 whitespace-nowrap relative z-20"
                      >
                        Add Goal
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editedProfile.learningGoals?.map(goal => (
                        <span key={goal} className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-xl text-sm flex items-center gap-2 font-medium">
                          {goal}
                          <button type="button" onClick={() => removeLearningGoal(goal)} className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  profile.learningGoals?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.learningGoals.map((goal, index) => (
                        <span key={index} className="px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-sm rounded-xl font-medium">
                          {goal}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-slate-400">No learning goals set</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;

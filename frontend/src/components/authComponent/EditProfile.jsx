import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { User, Calendar, Star, Target, Code, Briefcase, Award, TrendingUp, XIcon, Edit2, Save, X } from 'lucide-react';

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
    $workload: Int
    $skills: [SkillInput!]
    $GithubUsername: String
    $preferredRoles: [PreferredRole!]
    $preferences: PreferencesInput
    $learningGoals: [String!]
  ) {
    updateProfile(
      userId: $userId
      availability: $availability
      workload: $workload
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
      preferredRoles
      preferences {
        projectTypes
        domains
      }
      learningGoals
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
    variables: { userId }
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

  useEffect(() => {
    if (data?.getProfile) {
      setEditedProfile({
        GithubUsername: data.getProfile.GithubUsername,
        availability: data.getProfile.availability,
        workload: data.getProfile.workload,
        skills: data.getProfile.skills || [],
        preferredRoles: data.getProfile.preferredRoles || [],
        preferences: data.getProfile.preferences || { projectTypes: [], domains: [] },
        learningGoals: data.getProfile.learningGoals || [],
        experience: data.getProfile.experience || { totalYears: 0, currentLevel: 'junior', projectsCompleted: 0 }
      });
    }
  }, [data]);

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
        <div className="text-red-600 p-4 bg-red-100 rounded-lg">
          Error loading profile: {error.message}
        </div>
      </div>
    </div>
  );

  if (!data?.getProfile) return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
        <div className="text-gray-600 p-4 bg-gray-100 rounded-lg">
          No profile found for this user.
        </div>
      </div>
    </div>
  );

  const profile = data.getProfile;

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'junior': return 'bg-blue-100 text-blue-800';
      case 'mid': return 'bg-purple-100 text-purple-800';
      case 'senior': return 'bg-orange-100 text-orange-800';
      case 'lead': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    if (editedProfile.skills.length > 1) {
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
    const validSkills = editedProfile.skills.filter(s => s.name.trim() !== "").map(({ __typename, lastUsed, ...rest }) => ({
      ...rest,
      experienceYears: parseInt(rest.experienceYears) || 0,
      certifications: rest.certifications || []
    }));

    updateProfile({
      variables: {
        userId,
        availability: editedProfile.availability,
        workload: parseInt(editedProfile.workload, 10),
        skills: validSkills,
        GithubUsername: editedProfile.GithubUsername,
        preferredRoles: editedProfile.preferredRoles,
        preferences: editedProfile.preferences,
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

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 w-full max-w-6xl mx-4 rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
        
        {/* Header with close button */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Details</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${isEditing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 inline mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 inline mr-1" />
                  Edit
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={updating}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
              >
                <Save className="w-4 h-4 inline mr-1" />
                {updating ? 'Saving...' : 'Save'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400"
            >
              <XIcon size={22} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profile.user.username}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">{profile.user.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Role: {profile.user.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                      <select
                        value={editedProfile.availability}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, availability: e.target.value }))}
                        className="px-3 py-1 rounded-full text-sm font-medium border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {availabilityOptions.map(option => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Workload %</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={editedProfile.workload}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, workload: e.target.value }))}
                          min="0"
                          max="100"
                          className="w-20 p-1 text-sm border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <span className="text-sm text-gray-500 ml-1">%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(profile.availability)}`}>
                      {profile.availability}
                    </span>
                    <p className="text-sm text-gray-500">
                      Workload: {profile.workload}%
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Username</label>
                    <input
                      type="text"
                      value={editedProfile.GithubUsername}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, GithubUsername: e.target.value }))}
                      className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="GitHub Username"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    GitHub: @{profile.GithubUsername}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Joined: {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Experience & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experience
                </h3>
                {isEditing && (
                  <button
                    onClick={handleSaveExperience}
                    disabled={updatingExp}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    {updatingExp ? 'Saving...' : 'Save Exp'}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                    {isEditing ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Total Years</label>
                        <input
                          type="number"
                          value={editedProfile.experience?.totalYears || 0}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            experience: { ...prev.experience, totalYears: e.target.value }
                          }))}
                          className="text-2xl font-bold text-blue-600 w-full text-center border rounded bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-blue-400"
                          min="0"
                        />
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">{profile.experience.totalYears}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300">Years Experience</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                    {isEditing ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Projects</label>
                        <input
                          type="number"
                          value={editedProfile.experience?.projectsCompleted || 0}
                          onChange={(e) => setEditedProfile(prev => ({
                            ...prev,
                            experience: { ...prev.experience, projectsCompleted: e.target.value }
                          }))}
                          className="text-2xl font-bold text-green-600 w-full text-center border rounded bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-green-400"
                          min="0"
                        />
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-green-600">{profile.experience.projectsCompleted}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300">Projects Completed</p>
                  </div>
                </div>
                <div className="text-center">
                  {isEditing ? (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Experience Level</label>
                      <select
                        value={editedProfile.experience?.currentLevel || 'junior'}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          experience: { ...prev.experience, currentLevel: e.target.value }
                        }))}
                        className="px-3 py-1 rounded-full text-sm font-medium border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {experienceLevelOptions.map(level => (
                          <option key={level} value={level}>
                            {level.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(profile.experience.currentLevel)}`}>
                      {profile.experience.currentLevel.toUpperCase()} LEVEL
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Section - Read Only */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Completion Rate</span>
                  <span className="font-semibold">{profile.performance.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{profile.performance.averageRating}/5</span>
                    <span className="text-sm text-gray-500 ml-1">({profile.performance.totalRatings} reviews)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Collaboration Score</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="font-semibold">{profile.performance.collaborationScore}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Skills
            </h3>
            <div className="space-y-4">
              {(isEditing ? editedProfile.skills : profile.skills)?.map((skill, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-700">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Skill Name</label>
                          <input
                            type="text"
                            placeholder="e.g., JavaScript, React, Node.js"
                            value={skill.name}
                            onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Proficiency Level</label>
                          <select
                            value={skill.proficiency}
                            onChange={(e) => handleSkillChange(index, "proficiency", e.target.value)}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          >
                            {proficiencyOptions.map(level => (
                              <option key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={skill.experienceYears || 0}
                            onChange={(e) => handleSkillChange(index, "experienceYears", parseInt(e.target.value) || 0)}
                            min="0"
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      {/* Certifications */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Certifications</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="e.g., AWS Certified Developer, Google Cloud Professional"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => addCertification(index)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                          >
                            Add Certification
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(skill.certifications || []).map((cert, certIndex) => (
                            <span key={certIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                              {cert}
                              <button
                                type="button"
                                onClick={() => removeCertification(index, certIndex)}
                                className="text-blue-600 hover:text-blue-800"
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
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove Skill
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{skill.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                              {skill.proficiency}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {skill.experienceYears} years
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          Last used: {formatDate(skill.lastUsed)}
                        </span>
                      </div>
                      {skill.certifications?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {skill.certifications.map((cert, certIndex) => (
                              <span key={certIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
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
                <button type="button" onClick={addSkill} className="text-blue-600 hover:underline">
                  + Add New Skill
                </button>
              )}
            </div>
          </div>

          {/* Preferred Roles */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Preferred Roles</h3>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {preferredRoleOptions.map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedProfile.preferredRoles?.includes(role) || false}
                      onChange={() => handlePreferredRoleChange(role)}
                      className="mr-2"
                    />
                    {role.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.preferredRoles?.map((role, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {role.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Project Experience - Read Only */}
          {profile.experience.projectExperience?.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Project Experience</h3>
              <div className="space-y-4">
                {profile.experience.projectExperience.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{project.projectType}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {project.domain} • {project.role} • {project.duration} months
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(project.completedAt)}
                      </span>
                    </div>
                    {project.technologies?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded">
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
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                {/* Project Types */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Project Types</h4>
                  {isEditing ? (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="e.g., web-development, mobile-app, api-development"
                          value={newProjectType}
                          onChange={(e) => setNewProjectType(e.target.value)}
                          className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <button 
                          type="button" 
                          onClick={addProjectType} 
                          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 whitespace-nowrap"
                        >
                          Add Type
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editedProfile.preferences?.projectTypes?.map(type => (
                          <span key={type} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            {type}
                            <button type="button" onClick={() => removeProjectType(type)} className="text-green-600 hover:text-green-800">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences?.projectTypes?.map((type, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Domains */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Domains</h4>
                  {isEditing ? (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="e.g., e-commerce, healthcare, fintech, education"
                          value={newDomain}
                          onChange={(e) => setNewDomain(e.target.value)}
                          className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <button 
                          type="button" 
                          onClick={addDomain} 
                          className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 whitespace-nowrap"
                        >
                          Add Domain
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editedProfile.preferences?.domains?.map(domain => (
                          <span key={domain} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            {domain}
                            <button type="button" onClick={() => removeDomain(domain)} className="text-purple-600 hover:text-purple-800">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences?.domains?.map((domain, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          {domain}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
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
                      className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                    <button 
                      type="button" 
                      onClick={addLearningGoal} 
                      className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 whitespace-nowrap"
                    >
                      Add Goal
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.learningGoals?.map(goal => (
                      <span key={goal} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        {goal}
                        <button type="button" onClick={() => removeLearningGoal(goal)} className="text-yellow-600 hover:text-yellow-800">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                profile.learningGoals?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.learningGoals.map((goal, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        {goal}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No learning goals set</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;

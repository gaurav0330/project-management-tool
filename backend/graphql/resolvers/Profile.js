const profileService = require('../../services/profileService');

const profileResolvers = {
  Query: {
    getProfile: async (_, { userId }) => {
      return await profileService.getProfileByUserId(userId);
    },
    getAllProfiles: async () => {
      return await profileService.getAllProfiles();
    },
  },
  Mutation: {
    createProfile: async (_, { userId, skills, GithubUsername, availability, workload, preferredRoles }) => {
      return await profileService.createProfile(userId, skills, GithubUsername, availability, workload, preferredRoles);
    },
    
    updateProfile: async (_, { userId, availability, workload, skills, GithubUsername, preferredRoles, preferences, learningGoals }) => {
      const updates = { 
        availability, 
        workload, 
        skills, 
        GithubUsername, 
        preferredRoles, 
        preferences, 
        learningGoals
      };
      return await profileService.updateProfile(userId, updates);
    },

    addProjectExperience: async (_, { userId, projectExperience }) => {
      return await profileService.addProjectExperience(userId, projectExperience);
    },

    updateExperience: async (_, { userId, totalYears, currentLevel, projectsCompleted }) => {
      const experienceUpdates = { totalYears, currentLevel, projectsCompleted };
      return await profileService.updateExperience(userId, experienceUpdates);
    },
  },
};

module.exports = profileResolvers;

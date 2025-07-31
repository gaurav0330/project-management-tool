const profileService = require('../../services/profileService');

const profileResolvers = {
  Query: {
    getProfile: async (_, { userId }) => {
      try {
        return await profileService.getProfileByUserId(userId);
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }
    },
    
    getAllProfiles: async () => {
      try {
        return await profileService.getAllProfiles();
      } catch (error) {
        console.error('Error fetching all profiles:', error);
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }
    },
    
    getUserWorkload: async (_, { userId }) => {
      try {
        return await profileService.getUserWorkload(userId);
      } catch (error) {
        console.error('Error fetching user workload:', error);
        throw new Error(`Failed to fetch workload: ${error.message}`);
      }
    },
    
    getUserPerformanceMetrics: async (_, { userId }) => {
      try {
        return await profileService.getUserPerformanceMetrics(userId);
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
        throw new Error(`Failed to fetch performance metrics: ${error.message}`);
      }
    },
  },

  Mutation: {
    createProfile: async (_, { userId, skills, GithubUsername, availability, preferredRoles }) => {
      try {
        return await profileService.createProfile(userId, skills, GithubUsername, availability, preferredRoles);
      } catch (error) {
        console.error('Error creating profile:', error);
        throw new Error(`Failed to create profile: ${error.message}`);
      }
    },
    
    updateProfile: async (_, { userId, availability, skills, GithubUsername, preferredRoles, preferences, learningGoals }) => {
      try {
        const updates = { 
          availability, 
          skills, 
          GithubUsername, 
          preferredRoles, 
          preferences, 
          learningGoals
        };
        return await profileService.updateProfile(userId, updates);
      } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    },

    addProjectExperience: async (_, { userId, projectExperience }) => {
      try {
        return await profileService.addProjectExperience(userId, projectExperience);
      } catch (error) {
        console.error('Error adding project experience:', error);
        throw new Error(`Failed to add project experience: ${error.message}`);
      }
    },

    updateExperience: async (_, { userId, totalYears, currentLevel, projectsCompleted }) => {
      try {
        const experienceUpdates = { totalYears, currentLevel, projectsCompleted };
        return await profileService.updateExperience(userId, experienceUpdates);
      } catch (error) {
        console.error('Error updating experience:', error);
        throw new Error(`Failed to update experience: ${error.message}`);
      }
    },

    refreshUserWorkload: async (_, { userId }) => {
      try {
        return await profileService.refreshUserWorkload(userId);
      } catch (error) {
        console.error('Error refreshing workload:', error);
        throw new Error(`Failed to refresh workload: ${error.message}`);
      }
    },

    refreshUserPerformance: async (_, { userId }) => {
      try {
        return await profileService.refreshUserPerformance(userId);
      } catch (error) {
        console.error('Error refreshing performance:', error);
        throw new Error(`Failed to refresh performance: ${error.message}`);
      }
    },
  },

  // ✅ FIXED: Added proper error handling and null safety
  Profile: {
    workloadDetails: async (parent) => {
      try {
        if (parent._doc && parent._doc.workloadDetails) {
          return parent._doc.workloadDetails;
        }
        const userId = parent.user?._id || parent.user?.id || parent.user;
        if (!userId) {
          console.warn('No userId found for workloadDetails resolver');
          return null;
        }
        return await profileService.getUserWorkload(userId);
      } catch (error) {
        console.error('Error resolving workloadDetails:', error);
        return null;
      }
    },
    
    performanceMetrics: async (parent) => {
      try {
        if (parent._doc && parent._doc.performanceMetrics) {
          return parent._doc.performanceMetrics;
        }
        const userId = parent.user?._id || parent.user?.id || parent.user;
        if (!userId) {
          console.warn('No userId found for performanceMetrics resolver');
          return null;
        }
        return await profileService.getUserPerformanceMetrics(userId);
      } catch (error) {
        console.error('Error resolving performanceMetrics:', error);
        return null;
      }
    },
  },
};

module.exports = profileResolvers;

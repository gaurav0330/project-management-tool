const profileService = require('../../services/profileService');
const { ApolloError } = require('apollo-server-express');

const profileResolvers = {
  Query: {
    getProfile: async (_, { userId }) => {
      return await profileService.getProfileByUserId(userId);
    },
  },
  Mutation: {
    createProfile: async (_, { userId, skills, GithubUsername, availability, workload }) => {
      return await profileService.createProfile(userId, skills, GithubUsername, availability, workload);
    },
    
    updateProfile: async (_, { userId, availability, workload, skills, GithubUsername }) => {
      const updates = { availability, workload, skills, GithubUsername };
      return await profileService.updateProfile(userId, updates);
    },
  },
};

module.exports = profileResolvers;
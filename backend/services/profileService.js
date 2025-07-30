const Profile = require('../models/Profile');


const profileService = {
  createProfile: async (userId, skills = [], GithubUsername) => {
    const profile = new Profile({ user: userId, skills, GithubUsername });
    return await profile.save();
  },
  updateProfile: async (userId, updates) => {
    return await Profile.findOneAndUpdate({ user: userId }, updates, { new: true });
  },
  getProfileByUserId: async (userId) => {
    return await Profile.findOne({ user: userId }).populate('user');
  },
};

module.exports = profileService;
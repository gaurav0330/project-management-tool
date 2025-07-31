const Profile = require('../models/Profile');


const profileService = {
  createProfile: async (userId, skills = [], GithubUsername, availability = 'available', workload = 0) => {
    const profile = new Profile({ user: userId, skills, GithubUsername, availability, workload });
    return await profile.save();
  }
  ,
  updateProfile: async (userId, updates) => {
  // Remove undefined keys so they don't overwrite
  const filteredUpdates = {};
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
  });
  return await Profile.findOneAndUpdate({ user: userId }, filteredUpdates, { new: true });
},

  getProfileByUserId: async (userId) => {
    return await Profile.findOne({ user: userId }).populate('user');
  },
};

module.exports = profileService;
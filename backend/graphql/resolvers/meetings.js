// Add to your existing resolvers
const Meeting = require('../../models/Meeting');

const meetingResolvers = {
  Query: {
    getMeetingHistory: async (_, { groupId }) => {
      return await Meeting.find({ groupId }).sort({ createdAt: -1 });
    },
    
    getActiveMeeting: async (_, { groupId }) => {
      return await Meeting.findOne({ groupId, status: 'active' });
    }
  },

  Mutation: {
    createMeeting: async (_, { groupId, meetingId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const meeting = new Meeting({
        meetingId,
        groupId,
        createdBy: user.id,
        participants: [user.id]
      });
      
      return await meeting.save();
    },

    endMeeting: async (_, { meetingId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      return await Meeting.findOneAndUpdate(
        { meetingId },
        {
          status: 'ended',
          endedAt: new Date()
        },
        { new: true }
      );
    }
  }
};

module.exports = meetingResolvers;

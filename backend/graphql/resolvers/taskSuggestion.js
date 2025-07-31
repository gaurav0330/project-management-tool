const suggestionService = require('../../services/suggestionService');
const Project = require('../../models/Project');
const Team = require('../../models/Teams');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

const AiSuggestresolvers = {
  Query: {
    suggestAssignees: async (parent, { input }, context) => {
      const { user } = context;
      if (!user) throw new Error('Unauthorized');

      const { projectId, title, description, dueDate, priority } = input;

      // Fetch project
      const project = await Project.findById(projectId).populate('teamLeads.teamLeadId').populate('teams');
      if (!project) throw new Error('Project not found');

      let candidates = [];
      
      if (user.role === 'Project_Manager') {
        const teamLeadIds = project.teamLeads.map(lead => lead.teamLeadId);
        
        // Get users without population first
        const users = await User.find({
          _id: { $in: teamLeadIds },
          role: 'Team_Lead'
        });

        // 🔧 ALTERNATIVE: Manual profile lookup
        candidates = await Promise.all(
          users.map(async (candidateUser) => {
            const profile = await Profile.findOne({ user: candidateUser._id });
            return {
              ...candidateUser.toObject(),
              profile: profile
            };
          })
        );

      } else if (user.role === 'Team_Lead') {
        const team = await Team.findOne({
          projectId,
          leadId: user._id
        }).populate('members.teamMemberId');
        
        if (!team) throw new Error('Team not found for this lead');

        const memberIds = team.members.map(member => member.teamMemberId);
        
        const users = await User.find({
          _id: { $in: memberIds },
          role: 'Team_Member'
        });

        // 🔧 ALTERNATIVE: Manual profile lookup
        candidates = await Promise.all(
          users.map(async (candidateUser) => {
            const profile = await Profile.findOne({ user: candidateUser._id });
            return {
              ...candidateUser.toObject(),
              profile: profile
            };
          })
        );

      } else {
        throw new Error('Invalid role for suggestions');
      }

      if (candidates.length === 0) throw new Error('No candidates available');

      // Debug logging
      console.log('\n=== MANUAL LOOKUP DEBUG ===');
      candidates.forEach(candidate => {
        console.log(`- ${candidate.username}: profile = ${candidate.profile ? 'EXISTS' : 'NULL'}`);
        if (candidate.profile) {
          console.log(`  Profile user ref: ${candidate.profile.user}`);
          console.log(`  Skills: ${candidate.profile.skills?.length || 0}`);
          console.log(`  Availability: ${candidate.profile.availability}`);
        }
      });
      console.log('=== END MANUAL LOOKUP DEBUG ===\n');

      const suggestions = await suggestionService.getSuggestions({
        taskDetails: { title, description, dueDate, priority },
        candidates
      });

      return suggestions;
    }
  }
};

module.exports = AiSuggestresolvers;

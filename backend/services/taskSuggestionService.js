const axios = require('axios');
const User = require('../models/User');
const Task = require('../models/Task');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Team = require('../models/Teams');

const GEMINI_API_URL = 'https://api.gemini.ai/v1/rank';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // set your key here

async function getBestUserForTask({ projectId, title, userId, priority, dueDate, teamId = null }) {
  // 1. Get the assigner user (who is assigning)
  const assigner = await User.findById(userId).populate('profile');
  if (!assigner) throw new Error('Assigning user not found');

  // 2. Fetch project details with team leads and teams populated
  const project = await Project.findById(projectId).populate('teamLeads.teamLeadId teams');
  if (!project) throw new Error('Project not found');

  let candidates = [];

  if (assigner.role === 'Project_Manager') {
    // Assigning user is PM → choose best Team Lead in project
    candidates = await Promise.all(
      project.teamLeads.map(async (tl) => {
        const user = await User.findById(tl.teamLeadId).populate('profile');
        return user;
      })
    );
  } else if (assigner.role === 'Team_Lead') {
    if (!teamId) throw new Error('teamId is required when Team Lead is assigning');

    // Assigning user is TL → choose best Team Member in team
    const team = await Team.findById(teamId).populate({
      path: 'members.teamMemberId',
      populate: { path: 'profile' },
    });

    if (!team) throw new Error('Team not found');

    candidates = team.members.map((m) => m.teamMemberId);
  } else {
    throw new Error('Assigning user role must be Project_Manager or Team_Lead');
  }

  // Filter only users with profile since crucial info is there
  candidates = candidates.filter((u) => u && u.profile);

  if (!candidates.length) throw new Error('No candidates found');

  // 3. Prepare payload for Gemini ranking
  const geminiPayload = {
    apiKey: GEMINI_API_KEY,
    task: {
      title,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      projectId: projectId.toString(),
    },
    candidates: candidates.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      availability: user.profile.availability,
      workload: user.profile.workload,
      skills: user.profile.skills.map((s) => ({
        name: s.name,
        proficiency: s.proficiency,
        experienceYears: s.experienceYears,
      })),
      preferredRoles: user.profile.preferredRoles,
      experienceYears: user.profile.experience.totalYears,
      currentLevel: user.profile.experience.currentLevel,
      performance: user.profile.performance,
      learningGoals: user.profile.learningGoals,
      projectExperience: user.profile.experience.projectExperience.map((pe) => ({
        projectType: pe.projectType,
        domain: pe.domain,
        role: pe.role,
        duration: pe.duration,
      })),
    })),
  };

  // 4. Call Gemini API to rank candidates
  const response = await axios.post(GEMINI_API_URL, geminiPayload);
  if (response.status !== 200 || !response.data.results) {
    throw new Error('Failed to get ranking from Gemini');
  }

  // 5. Extract best user id
  const rankedCandidates = response.data.results; // assumed sorted by best fit descending

  const bestUserId = rankedCandidates[0]?.id;
  if (!bestUserId) throw new Error('No best user found by Gemini');

  // 6. Return best user full info
  const bestUser = candidates.find((u) => u._id.toString() === bestUserId);
  return bestUser;
}

module.exports = { getBestUserForTask };

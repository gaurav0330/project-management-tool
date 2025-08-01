require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Profile = require('../models/Profile');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const fallbackScoring = (taskDetails, candidate) => {
  let score = 0;
  const profile = candidate.profile || {};

  const inferredSkills = inferSkillsFromDescription(taskDetails.description || '');

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const skillMatch = skills.filter(skill =>
    inferredSkills.includes((skill.name || '').toLowerCase())
  ).length;

  score += (skillMatch / (skills.length || 1)) * 40;

  const availability = profile.availability || 'unknown';
  const workload = profile.workload || 100;
  if (availability === 'available' && workload < 80) score += 30;
  else if (availability === 'busy') score += 10;
  else if (availability === 'unknown') score += 5;

  score += ((profile.experience?.totalYears || 0) / 10) * 15;
  score += ((profile.performance?.averageRating || 0) / 5) * 15;

  const reasons = [];
  if (skillMatch > 0) reasons.push('Good skill match');
  if (workload < 50) reasons.push('Low workload');
  if (availability === 'available') reasons.push('Available');
  if (!candidate.profile) reasons.push('No profile - fallback scoring');

  return { score: Math.min(score, 100), reasons };
};

const inferSkillsFromDescription = (desc) => {
  const keywords = {
    frontend: ['ui', 'react', 'vue', 'html', 'css'],
    backend: ['node', 'express', 'api', 'database', 'server'],
    mobile: ['flutter', 'react native', 'android', 'ios']
  };
  return Object.keys(keywords).filter(key =>
    keywords[key].some(word => desc.toLowerCase().includes(word))
  );
};

const cleanAIResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.substring(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.substring(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  return cleaned.split('`').join('').trim();
};

const getSuggestions = async ({ taskDetails, candidates }) => {
  if (!candidates || candidates.length === 0) {
    console.warn('No candidates provided - returning empty suggestions');
    return { bestUser: null, rankedList: [] };
  }

  try {
    const candidateData = candidates.map(c => ({
      userId: c._id?.toString() || 'unknown',
      username: c.username || 'Unknown',
      role: c.role || 'Unknown',
      profile: {
        skills: (Array.isArray(c.profile?.skills) ? c.profile.skills.map(s => s.name || 'Unknown') : []),
        availability: c.profile?.availability || 'unknown',
        workload: c.profile?.workload || 100,
        experience: c.profile?.experience?.totalYears || 0,
        performance: c.profile?.performance?.averageRating || 0
      }
    }));

    const prompt = `You are a task assignment AI... (same as before)`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanAIResponse(responseText);

    let response;
    try {
      response = JSON.parse(cleanedText);
    } catch (err) {
      console.error('Gemini JSON parse error:', err);
      throw new Error('Invalid JSON from Gemini');
    }

    const enrich = (sugg) => {
      const user = candidates.find(c => c._id?.toString() === sugg.userId);
      if (!user) return null;
      return {
        userId: sugg.userId,
        username: user.username,
        role: user.role,
        score: sugg.score,
        reasons: sugg.reasons,
        profile: user.profile
      };
    };

    const bestUser = response.bestUser ? enrich(response.bestUser) : null;
    const rankedList = (response.rankedList || []).map(enrich).filter(Boolean);

    return {
      bestUser,
      rankedList
    };

  } catch (error) {
    console.error('Gemini error or fallback:', error);

    const scored = candidates.map(candidate => {
      const { score, reasons } = fallbackScoring(taskDetails, candidate);
      return {
        userId: candidate._id,
        username: candidate.username,
        role: candidate.role,
        score,
        reasons,
        profile: candidate.profile
      };
    }).filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      return {
        bestUser: scored[0],
        rankedList: scored.slice(0, 5)
      };
    } else {
      console.warn('No suitable scored candidates — selecting random fallback');

      const fallbackCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      return {
        bestUser: {
          userId: fallbackCandidate._id,
          username: fallbackCandidate.username,
          role: fallbackCandidate.role,
          score: 50,
          reasons: ['Random fallback candidate (no profiles matched)'],
          profile: fallbackCandidate.profile || null
        },
        rankedList: []
      };
    }
  }
};

module.exports = { getSuggestions };

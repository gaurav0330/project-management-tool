require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Profile = require('../models/Profile');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Fallback scoring function
const fallbackScoring = (taskDetails, candidate) => {
  let score = 0;
  const profile = candidate.profile || {};

  const inferredSkills = inferSkillsFromDescription(taskDetails.description || '');

  // Skills match (40%)
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const skillMatch = skills.filter(skill => inferredSkills.includes((skill.name || '').toLowerCase())).length;
  score += (skillMatch / (skills.length || 1)) * 40;

  // Workload/Availability (30%)
  const availability = profile.availability || 'unknown';
  const workload = profile.workload || 100;
  if (availability === 'available' && workload < 80) score += 30;
  else if (availability === 'busy') score += 10;
  else if (availability === 'unknown') score += 5;

  // Experience/Performance (30%)
  score += ((profile.experience?.totalYears || 0) / 10) * 15;
  score += ((profile.performance?.averageRating || 0) / 5) * 15;

  const reasons = [];
  if (skillMatch > 0) reasons.push('Good skill match');
  if (workload < 50) reasons.push('Low workload');
  if (availability === 'available') reasons.push('Available');
  if (!candidate.profile) reasons.push('No profile - suggestion based on basics');

  return { score: Math.min(score, 100), reasons };
};

const inferSkillsFromDescription = (desc) => {
  const keywords = {
    frontend: ['ui', 'react', 'vue', 'html', 'css'],
    backend: ['node', 'express', 'api', 'database', 'server'],
    mobile: ['flutter', 'react native', 'android', 'ios']
  };
  return Object.keys(keywords).filter(key => keywords[key].some(word => desc.toLowerCase().includes(word)));
};

// CLEAN RESPONSE FUNCTION - No Regex!
const cleanAIResponse = (text) => {
  // Remove common markdown wrappers using string methods
  let cleaned = text.trim();
  
  // Remove starting ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  }
  
  // Remove starting ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  
  // Remove ending ```
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  // Remove any remaining backticks
  cleaned = cleaned.split('`').join('');
  
  return cleaned.trim();
};

const getSuggestions = async ({ taskDetails, candidates }) => {
  if (!candidates || candidates.length === 0) {
    console.warn('No candidates provided - returning empty suggestions');
    return {
      bestUser: null,
      rankedList: []
    };
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

    // 🔍 DEBUG: Log processed candidate data for AI
    console.log('\n=== PROCESSED DATA FOR AI ===');
    console.log(JSON.stringify(candidateData, null, 2));
    console.log('=== END PROCESSED DATA ===\n');

    const prompt = `You are a task assignment AI. Analyze the task and suggest the best candidates.

Task: ${taskDetails.title}
Description: ${taskDetails.description || 'N/A'}
Priority: ${taskDetails.priority || 'Medium'}

Candidates: ${JSON.stringify(candidateData)}

Return ONLY this JSON format (no markdown, no extra text):
{
  "bestUser": {"userId": "ID_HERE", "score": 85, "reasons": ["reason1", "reason2"]},
  "rankedList": [{"userId": "ID_HERE", "score": 85, "reasons": ["reason1"]}]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response using string methods (no regex!)
    const cleanedText = cleanAIResponse(responseText);
    
    let response;
    try {
      response = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Gemini parse error:', parseError);
      console.log('Raw response:', responseText);
      console.log('Cleaned response:', cleanedText);
      throw new Error('Invalid JSON from Gemini');
    }

    // Enrich with full user data
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
    console.error('Gemini error:', error);
    
    // Fallback to manual scoring
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

    return {
      bestUser: scored[0] || null,
      rankedList: scored.slice(0, 5)
    };
  }
};

module.exports = { getSuggestions };

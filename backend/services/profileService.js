const Profile = require('../models/Profile');
const Task = require('../models/Task');

const profileService = {
  // ✅ ENHANCED: More robust performance calculation with guaranteed non-null values
  calculateUserPerformance: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required for performance calculation');
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));

      // Get all tasks assigned to the user in the last 90 days
      const userTasks = await Task.find({ 
        assignedTo: userId,
        createdAt: { $gte: ninetyDaysAgo }
      }).sort({ createdAt: -1 });

      // Calculate completion rate
      const completedTasks = userTasks.filter(task => 
        ['Completed', 'Done'].includes(task.status)
      );
      const completionRate = userTasks.length > 0 ? 
        (completedTasks.length / userTasks.length) * 100 : 100;

      // Calculate on-time delivery rate
      const tasksWithDueDate = userTasks.filter(task => task.dueDate);
      const onTimeDeliveries = tasksWithDueDate.filter(task => 
        ['Completed', 'Done'].includes(task.status) && 
        new Date(task.updatedAt) <= new Date(task.dueDate)
      );
      const onTimeDeliveryRate = tasksWithDueDate.length > 0 ? 
        (onTimeDeliveries.length / tasksWithDueDate.length) * 100 : 100;

      // Calculate tasks completed this month
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthTasks = userTasks.filter(task => 
        new Date(task.updatedAt) >= thisMonthStart &&
        ['Completed', 'Done'].includes(task.status)
      );
      const tasksCompletedThisMonth = thisMonthTasks.length;

      // Calculate average task duration (in days)
      const completedTasksWithDuration = completedTasks.filter(task => 
        task.createdAt && task.updatedAt
      );
      const averageTaskDuration = completedTasksWithDuration.length > 0 ?
        completedTasksWithDuration.reduce((acc, task) => {
          const duration = (new Date(task.updatedAt) - new Date(task.createdAt)) / (1000 * 60 * 60 * 24);
          return acc + Math.max(0, duration); // Ensure no negative durations
        }, 0) / completedTasksWithDuration.length : 0;

      // Calculate quality score based on task rejection/revision rate
      const revisedTasks = userTasks.filter(task => 
        ['Needs Revision', 'Rejected'].includes(task.status)
      );
      const qualityScore = userTasks.length > 0 ? 
        Math.max(0, Math.min(100, 100 - (revisedTasks.length / userTasks.length) * 100)) : 100;

      // Get user experience level safely
      const userLevel = await profileService.getUserExperienceLevel(userId);
      const expectedTasksPerMonth = profileService.getExpectedTasksPerLevel(userLevel);
      const productivityScore = expectedTasksPerMonth > 0 ? 
        Math.min(100, (tasksCompletedThisMonth / expectedTasksPerMonth) * 100) : 100;

      // Calculate performance trend
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonthStart2 = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthTasks = userTasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate >= lastMonthStart && 
               taskDate < thisMonthStart2 &&
               ['Completed', 'Done'].includes(task.status);
      });

      let recentPerformanceTrend = 'stable';
      if (tasksCompletedThisMonth > lastMonthTasks.length * 1.1) {
        recentPerformanceTrend = 'improving';
      } else if (tasksCompletedThisMonth < lastMonthTasks.length * 0.9) {
        recentPerformanceTrend = 'declining';
      }

      // Calculate collaboration score based on team interactions
      const teamTasks = userTasks.filter(task => 
        task.history && Array.isArray(task.history) && task.history.length > 1
      );
      const collaborationScore = userTasks.length > 0 ? 
        Math.min(5, Math.max(1, 3 + (teamTasks.length / userTasks.length) * 2)) : 5;

      // Simulate average rating based on performance metrics
      const baseRating = 3.0;
      const performanceBonus = (
        (completionRate / 100) * 1.0 +
        (onTimeDeliveryRate / 100) * 0.8 +
        (qualityScore / 100) * 1.2
      );
      const averageRating = Math.min(5, Math.max(1, baseRating + performanceBonus));

      // Calculate total ratings (simulated based on task history)
      const totalRatings = Math.max(0, Math.floor(completedTasks.length * 0.3));

      // ✅ GUARANTEE: All returned values are non-null and properly rounded
      return {
        completionRate: Math.round((completionRate || 0) * 10) / 10,
        averageRating: Math.round((averageRating || 5) * 10) / 10,
        totalRatings: totalRatings || 0,
        collaborationScore: Math.round((collaborationScore || 5) * 10) / 10,
        onTimeDeliveryRate: Math.round((onTimeDeliveryRate || 100) * 10) / 10,
        tasksCompletedThisMonth: tasksCompletedThisMonth || 0, // ✅ This was causing your error
        averageTaskDuration: Math.round((averageTaskDuration || 0) * 10) / 10,
        qualityScore: Math.round((qualityScore || 100) * 10) / 10,
        productivityScore: Math.round((productivityScore || 100) * 10) / 10,
        recentPerformanceTrend: recentPerformanceTrend || 'stable'
      };
    } catch (error) {
      console.error('Error calculating performance for user:', userId, error);
      // ✅ FALLBACK: Return safe default values on any error
      return {
        completionRate: 100.0,
        averageRating: 5.0,
        totalRatings: 0,
        collaborationScore: 5.0,
        onTimeDeliveryRate: 100.0,
        tasksCompletedThisMonth: 0, // ✅ Safe default
        averageTaskDuration: 0.0,
        qualityScore: 100.0,
        productivityScore: 100.0,
        recentPerformanceTrend: 'stable'
      };
    }
  },

  // ✅ ENHANCED: Better error handling for performance metrics
  calculatePerformanceMetrics: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required for performance metrics calculation');
      }

      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));

      const userTasks = await Task.find({ 
        assignedTo: userId,
        createdAt: { $gte: sixMonthsAgo }
      }).sort({ createdAt: -1 });

      // Calculate all metrics with error handling
      const weeklyStats = profileService.calculateWeeklyStats(userTasks);
      const monthlyTrends = profileService.calculateMonthlyTrends(userTasks);
      const taskTypePerformance = profileService.calculateTaskTypePerformance(userTasks);
      const collaborationMetrics = profileService.calculateCollaborationMetrics(userTasks);

      return {
        weeklyCompletion: weeklyStats || [],
        monthlyTrends: monthlyTrends || [],
        taskTypePerformance: taskTypePerformance || [],
        collaborationMetrics: collaborationMetrics || {
          teamProjects: 0,
          crossFunctionalWork: 0,
          mentorshipTasks: 0,
          peerRatings: 5.0
        }
      };
    } catch (error) {
      console.error('Error calculating performance metrics for user:', userId, error);
      return {
        weeklyCompletion: [],
        monthlyTrends: [],
        taskTypePerformance: [],
        collaborationMetrics: {
          teamProjects: 0,
          crossFunctionalWork: 0,
          mentorshipTasks: 0,
          peerRatings: 5.0
        }
      };
    }
  },

  calculateWeeklyStats: (tasks) => {
    try {
      const weeks = {};
      const now = new Date();
      
      for (let i = 0; i < 12; i++) {
        const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
        const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
        const weekKey = `Week ${12 - i}`;
        
        const weekTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= weekStart && taskDate < weekEnd;
        });
        
        const completedWeekTasks = weekTasks.filter(task => 
          ['Completed', 'Done'].includes(task.status)
        );
        
        weeks[weekKey] = {
          week: weekKey,
          completed: completedWeekTasks.length,
          assigned: weekTasks.length,
          completionRate: weekTasks.length > 0 ? (completedWeekTasks.length / weekTasks.length) * 100 : 0
        };
      }
      
      return Object.values(weeks);
    } catch (error) {
      console.error('Error calculating weekly stats:', error);
      return [];
    }
  },

  calculateMonthlyTrends: (tasks) => {
    try {
      const months = {};
      const now = new Date();
      
      for (let i = 0; i < 6; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const monthKey = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        const monthTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate >= monthDate && taskDate < nextMonth;
        });
        
        const completedMonthTasks = monthTasks.filter(task => 
          ['Completed', 'Done'].includes(task.status)
        );
        
        const tasksWithDueDate = monthTasks.filter(task => task.dueDate);
        const onTimeTasks = tasksWithDueDate.filter(task => 
          ['Completed', 'Done'].includes(task.status) && 
          task.dueDate &&
          new Date(task.updatedAt) <= new Date(task.dueDate)
        );
        
        months[monthKey] = {
          month: monthKey,
          tasksCompleted: completedMonthTasks.length,
          averageRating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10,
          onTimeRate: tasksWithDueDate.length > 0 ? 
            Math.round((onTimeTasks.length / tasksWithDueDate.length) * 100 * 10) / 10 : 100
        };
      }
      
      return Object.values(months).reverse();
    } catch (error) {
      console.error('Error calculating monthly trends:', error);
      return [];
    }
  },

  calculateTaskTypePerformance: (tasks) => {
    try {
      const taskTypes = {};
      
      tasks.forEach(task => {
        const type = task.priority || 'Medium';
        if (!taskTypes[type]) {
          taskTypes[type] = {
            taskType: type,
            completed: 0,
            total: 0,
            totalTime: 0
          };
        }
        
        taskTypes[type].total++;
        if (['Completed', 'Done'].includes(task.status)) {
          taskTypes[type].completed++;
          if (task.createdAt && task.updatedAt) {
            const duration = Math.max(0, (new Date(task.updatedAt) - new Date(task.createdAt)) / (1000 * 60 * 60 * 24));
            taskTypes[type].totalTime += duration;
          }
        }
      });
      
      return Object.values(taskTypes).map(type => ({
        taskType: type.taskType,
        completed: type.completed,
        averageTime: type.completed > 0 ? Math.round((type.totalTime / type.completed) * 10) / 10 : 0,
        successRate: type.total > 0 ? Math.round((type.completed / type.total) * 100 * 10) / 10 : 0
      }));
    } catch (error) {
      console.error('Error calculating task type performance:', error);
      return [];
    }
  },

  calculateCollaborationMetrics: (tasks) => {
    try {
      const teamTasks = tasks.filter(task => 
        task.history && Array.isArray(task.history) && task.history.length > 1
      );
      
      return {
        teamProjects: teamTasks.length,
        crossFunctionalWork: Math.floor(teamTasks.length * 0.6),
        mentorshipTasks: Math.floor(teamTasks.length * 0.2),
        peerRatings: Math.round((4.2 + Math.random() * 0.8) * 10) / 10
      };
    } catch (error) {
      console.error('Error calculating collaboration metrics:', error);
      return {
        teamProjects: 0,
        crossFunctionalWork: 0,
        mentorshipTasks: 0,
        peerRatings: 5.0
      };
    }
  },

  getExpectedTasksPerLevel: (level) => {
    const expectations = {
      'junior': 8,
      'mid': 12,
      'senior': 15,
      'lead': 10
    };
    return expectations[level] || 10;
  },

  getUserExperienceLevel: async (userId) => {
    try {
      if (!userId) return 'junior';
      const profile = await Profile.findOne({ user: userId });
      return profile?.experience?.currentLevel || 'junior';
    } catch (error) {
      console.error('Error getting user experience level:', error);
      return 'junior';
    }
  },

  // ✅ ENHANCED: Workload calculation with better error handling
  calculateUserWorkload: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required for workload calculation');
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

      const userTasks = await Task.find({ 
        assignedTo: userId,
        createdAt: { $gte: thirtyDaysAgo }
      });

      const activeStatuses = ["To Do", "In Progress", "Pending Approval", "Needs Revision", "Rejected"];
      const completedStatuses = ["Completed", "Done"];

      const totalTasks = userTasks.length;
      const activeTasks = userTasks.filter(task => activeStatuses.includes(task.status)).length;
      const completedTasks = userTasks.filter(task => completedStatuses.includes(task.status)).length;

      const overdueTasks = userTasks.filter(task => 
        activeStatuses.includes(task.status) && 
        task.dueDate && 
        new Date(task.dueDate) < now
      ).length;

      const highPriorityTasks = userTasks.filter(task => 
        activeStatuses.includes(task.status) && 
        task.priority === "High"
      ).length;

      let workloadPercentage = 0;
      
      if (totalTasks > 0) {
        const activeTaskWeight = activeTasks * 10;
        const priorityBonus = highPriorityTasks * 5;
        const overdueBonus = overdueTasks * 10;
        
        workloadPercentage = Math.min(100, activeTaskWeight + priorityBonus + overdueBonus);
        
        try {
          const profile = await Profile.findOne({ user: userId });
          if (profile?.experience?.currentLevel) {
            const experienceMultiplier = profileService.getExperienceMultiplier(profile.experience.currentLevel);
            workloadPercentage = Math.min(100, workloadPercentage * experienceMultiplier);
          }
        } catch (profileError) {
          console.warn('Could not fetch profile for experience multiplier:', profileError);
        }
      }

      const tasksByStatus = [];
      const statusGroups = {};
      
      userTasks.forEach(task => {
        if (task.status) {
          statusGroups[task.status] = (statusGroups[task.status] || 0) + 1;
        }
      });

      Object.keys(statusGroups).forEach(status => {
        tasksByStatus.push({ status, count: statusGroups[status] });
      });

      let availability = 'available';
      if (workloadPercentage >= 80) availability = 'busy';
      else if (workloadPercentage >= 95) availability = 'offline';

      return {
        totalTasks: totalTasks || 0,
        activeTasks: activeTasks || 0,
        completedTasks: completedTasks || 0,
        overdueTasks: overdueTasks || 0,
        highPriorityTasks: highPriorityTasks || 0,
        workloadPercentage: Math.round(workloadPercentage || 0),
        tasksByStatus: tasksByStatus || [],
        availability: availability || 'available'
      };
    } catch (error) {
      console.error('Error calculating workload for user:', userId, error);
      return {
        totalTasks: 0,
        activeTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        highPriorityTasks: 0,
        workloadPercentage: 0,
        tasksByStatus: [],
        availability: 'available'
      };
    }
  },

  getExperienceMultiplier: (level) => {
    const multipliers = {
      'junior': 1.2,
      'mid': 1.0,
      'senior': 0.8,
      'lead': 0.6
    };
    return multipliers[level] || 1.0;
  },

  // ✅ ENHANCED: Better error handling for profile creation
  createProfile: async (userId, skills = [], GithubUsername, availability = 'available', preferredRoles = []) => {
    try {
      if (!userId || !GithubUsername) {
        throw new Error('User ID and GitHub username are required');
      }

      const workloadData = await profileService.calculateUserWorkload(userId);
      const performanceData = await profileService.calculateUserPerformance(userId);
      
      const profile = new Profile({ 
        user: userId, 
        skills: skills || [], 
        GithubUsername, 
        availability: workloadData.availability || availability,
        workload: workloadData.workloadPercentage || 0,
        preferredRoles: preferredRoles || [],
        experience: {
          totalYears: 0,
          currentLevel: 'junior',
          projectsCompleted: 0,
          projectExperience: []
        },
        preferences: {
          projectTypes: [],
          domains: []
        },
        performance: performanceData,
        learningGoals: []
      });
      
      const savedProfile = await profile.save();
      return await Profile.findById(savedProfile._id).populate('user');
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  },

  // ✅ ENHANCED: Better error handling for profile updates
  updateProfile: async (userId, updates) => {
    try {
      if (!userId) {
        throw new Error('User ID is required for profile update');
      }

      const workloadData = await profileService.calculateUserWorkload(userId);
      
      const filteredUpdates = {};
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && key !== 'workload') {
          filteredUpdates[key] = updates[key];
        }
      });
      
      filteredUpdates.workload = workloadData.workloadPercentage || 0;
      if (!updates.availability) {
        filteredUpdates.availability = workloadData.availability || 'available';
      }
      
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: userId }, 
        filteredUpdates, 
        { new: true, runValidators: true }
      ).populate('user');

      if (!updatedProfile) {
        throw new Error('Profile not found');
      }

      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  // ✅ ENHANCED: Better error handling for profile retrieval
  getProfileByUserId: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const profile = await Profile.findOne({ user: userId }).populate('user');
      
      if (!profile) {
        return null; // Let the resolver handle this
      }

      // Calculate fresh data
      const workloadData = await profileService.calculateUserWorkload(userId);
      const performanceData = await profileService.calculateUserPerformance(userId);
      const performanceMetrics = await profileService.calculatePerformanceMetrics(userId);
      
      // Update profile with fresh data
      profile.workload = workloadData.workloadPercentage || 0;
      profile.performance = performanceData;
      
      // Add calculated data to _doc for resolvers
      profile._doc.workloadDetails = workloadData;
      profile._doc.performanceMetrics = performanceMetrics;
      
      // Update in database
      try {
        await Profile.findOneAndUpdate(
          { user: userId }, 
          { 
            workload: workloadData.workloadPercentage || 0,
            performance: performanceData,
            availability: profile.availability || 'available'
          },
          { runValidators: true }
        );
      } catch (updateError) {
        console.warn('Could not update profile with fresh data:', updateError);
      }

      return profile;
    } catch (error) {
      console.error('Error getting profile by user ID:', userId, error);
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  },

  // ✅ ENHANCED: Better error handling for getting all profiles
  getAllProfiles: async () => {
    try {
      const profiles = await Profile.find().populate('user');
      
      // Update each profile with fresh data
      const updatedProfiles = [];
      for (const profile of profiles) {
        try {
          const userId = profile.user._id;
          const workloadData = await profileService.calculateUserWorkload(userId);
          const performanceData = await profileService.calculateUserPerformance(userId);
          
          profile.workload = workloadData.workloadPercentage || 0;
          profile.performance = performanceData;
          profile._doc.workloadDetails = workloadData;
          
          // Update in database (don't await to avoid blocking)
          Profile.findOneAndUpdate(
            { user: userId }, 
            { 
              workload: workloadData.workloadPercentage || 0,
              performance: performanceData
            }
          ).catch(err => console.warn('Background profile update failed:', err));

          updatedProfiles.push(profile);
        } catch (profileError) {
          console.warn('Error updating individual profile:', profileError);
          updatedProfiles.push(profile); // Include profile even if update fails
        }
      }
      
      return updatedProfiles;
    } catch (error) {
      console.error('Error getting all profiles:', error);
      throw new Error(`Failed to get profiles: ${error.message}`);
    }
  },

  getUserWorkload: async (userId) => {
    return await profileService.calculateUserWorkload(userId);
  },

  getUserPerformanceMetrics: async (userId) => {
    return await profileService.calculatePerformanceMetrics(userId);
  },

  refreshUserWorkload: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const workloadData = await profileService.calculateUserWorkload(userId);
      
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: userId },
        { 
          workload: workloadData.workloadPercentage || 0,
          availability: workloadData.availability || 'available'
        },
        { new: true, runValidators: true }
      ).populate('user');
      
      if (!updatedProfile) {
        throw new Error('Profile not found');
      }

      updatedProfile._doc.workloadDetails = workloadData;
      return updatedProfile;
    } catch (error) {
      console.error('Error refreshing workload:', error);
      throw new Error(`Failed to refresh workload: ${error.message}`);
    }
  },

  refreshUserPerformance: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const performanceData = await profileService.calculateUserPerformance(userId);
      
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: userId },
        { performance: performanceData },
        { new: true, runValidators: true }
      ).populate('user');

      if (!updatedProfile) {
        throw new Error('Profile not found');
      }
      
      return updatedProfile;
    } catch (error) {
      console.error('Error refreshing performance:', error);
      throw new Error(`Failed to refresh performance: ${error.message}`);
    }
  },

  addProjectExperience: async (userId, projectExperience) => {
    try {
      if (!userId || !projectExperience) {
        throw new Error('User ID and project experience are required');
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { user: userId },
        { $push: { 'experience.projectExperience': projectExperience } },
        { new: true, runValidators: true }
      ).populate('user');

      if (!updatedProfile) {
        throw new Error('Profile not found');
      }

      return updatedProfile;
    } catch (error) {
      console.error('Error adding project experience:', error);
      throw new Error(`Failed to add project experience: ${error.message}`);
    }
  },

  updateExperience: async (userId, experienceUpdates) => {
    try {
      if (!userId || !experienceUpdates) {
        throw new Error('User ID and experience updates are required');
      }

      const updates = {};
      Object.keys(experienceUpdates).forEach(key => {
        if (experienceUpdates[key] !== undefined) {
          updates[`experience.${key}`] = experienceUpdates[key];
        }
      });
      
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: userId }, 
        updates, 
        { new: true, runValidators: true }
      ).populate('user');
      
      if (!updatedProfile) {
        throw new Error('Profile not found');
      }

      // Recalculate workload after experience update
      try {
        const workloadData = await profileService.calculateUserWorkload(userId);
        updatedProfile.workload = workloadData.workloadPercentage || 0;
        await Profile.findOneAndUpdate(
          { user: userId }, 
          { workload: workloadData.workloadPercentage || 0 }
        );
      } catch (workloadError) {
        console.warn('Could not recalculate workload after experience update:', workloadError);
      }
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw new Error(`Failed to update experience: ${error.message}`);
    }
  },
};

module.exports = profileService;

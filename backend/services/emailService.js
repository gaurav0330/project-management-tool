const nodemailer = require("nodemailer");

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gbchannel777@gmail.com", // Your email
    pass: "zrbp alkn ajnk vnhe", // Your app password
  },
});
 
/**
 * Generic function to send an email
 */
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: "gbchannel777@gmail.com",
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject: "${subject}"`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * Send login alert email
 */
const sendLoginEmail = async (username, email, role) => {
  const roleMessages = {
    "Project_Manager": "You can now manage projects, assign tasks, and track progress.",
    "Team_Lead": "You can now oversee your team's tasks and ensure project success.",
    "Team_Member": "You can now check your assigned tasks and update your progress.",
  };

  const message = `Hello ${username},\n\nYour account as a **${role}** was just logged into. ${roleMessages[role]}\n\nIf this wasn't you, please reset your password immediately.\n\nBest,\nProject Management Team`;

  await sendEmail(email, "Login Alert - Project Management Tool", message);
};


/**
 * Notify a Team Lead when they are assigned to a project
 */
const sendTeamLeadAssignmentEmail = async (username, email, projectName) => {
  const subject = "Project Assignment Notification";
  const message = `Hello ${username},\n\nYou have been assigned as a Team Lead for the project **${projectName}**.\n\nPlease check your dashboard for further details.\n\nBest,\nProject Management Team`;

  await sendEmail(email, subject, message);
};

/**
 * Notify a Team Member when they are assigned a task
 */
const sendTaskAssignedEmail = async ({ email, teamLeadName, projectManager, projectName, taskTitle, priority, dueDate }) => {
  const subject = `New Task Assigned - ${taskTitle}`;

  const message = `
  Hello ${teamLeadName},\n\n
  A new task **"${taskTitle}"** has been assigned to you by **${projectManager}** in the project **"${projectName}"**.\n\n
  📌 **Priority**: ${priority}\n
  🗓️ **Due Date**: ${dueDate}\n\n
  Please check your dashboard for more details.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};

/**
 * Notify a Team Lead or Project Manager when a task status approval email  updates
 */
const sendTaskApprovalEmail = async ({ email, teamMemberName, projectManager, projectName, taskTitle, status, remarks }) => {
  const subject = `Task ${status} - ${taskTitle}`;

  const message = `
  Hello ${teamMemberName},\n\n
  Your task **"${taskTitle}"** in the project **"${projectName}"** has been **${status}** by **${projectManager}**.\n\n
  📌 **Remarks**: ${remarks}\n\n
  Please check your dashboard for more details.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};

/**
 * Notify a Team Lead or Project Manager when a task status reject email  updates
 */
const sendTaskRejectionEmail = async ({ email, teamMemberName, projectManager, projectName, taskTitle, reason }) => {
  const subject = `Task Rejected - ${taskTitle}`;

  const message = `
  Hello ${teamMemberName},\n\n
  Your task **"${taskTitle}"** in the project **"${projectName}"** has been **Rejected ❌** by **${projectManager}**.\n\n
  📌 **Reason**: ${reason}\n\n
  Please check your dashboard for details.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};

/**
 * Notify a Team Lead or Project Manager when a task status request for modification email  updates
 */
const sendTaskModificationEmail = async ({ email, teamMemberName, projectManager, projectName, taskTitle, feedback }) => {
  const subject = `Task Needs Revision - ${taskTitle}`;

  const message = `
  Hello ${teamMemberName},\n\n
  Your task **"${taskTitle}"** in the project **"${projectName}"** requires modifications as requested by **${projectManager}**.\n\n
  📌 **Feedback**: ${feedback}\n\n
  Please check your dashboard for details.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};

const sendTeamAssignEmail = async ({ email, teamMemberName, teamLeadName, projectName, role }) => {
  const subject = `You have been assigned to ${projectName}`;

  const message = `
  Hello ${teamMemberName},\n\n
  You have been assigned as a **${role}** in the project **"${projectName}"** by **${teamLeadName}**.\n\n
  Please check your dashboard for further details.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};

const sendTaskSubmissionEmail = async ({ email, assignerName, taskTitle, submittedBy }) => {
  const subject = `Task Submitted for Approval - ${taskTitle}`;

  const message = `
  Hello ${assignerName},\n\n
  The task **"${taskTitle}"** has been submitted for approval by **${submittedBy}**.\n\n
  Please review and approve/reject the task in your dashboard.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};

const sendTaskApprovalRequestEmail = async ({ email, managerName, taskTitle, submittedBy }) => {
  const subject = `Task Submitted for Approval - ${taskTitle}`;

  const message = `
  Hello ${managerName},\n\n
  The task **"${taskTitle}"** has been submitted for approval by **${submittedBy}**.\n\n
  Please review and approve/reject the task in your dashboard.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};

const sendTeamMemberAddedEmail = async ({ email, memberName, teamName, leadName }) => {
  const subject = `Welcome to the Team - ${teamName}`;

  const message = `
  Hello ${memberName},\n\n
  You have been added to the team **"${teamName}"** by **${leadName}**.\n\n
  Please log in to your dashboard to view team details and assigned tasks.\n\n
  Best,\n
  Project Management Team
  `;

  await sendEmail(email, subject, message);
};
 

// Export all functions
module.exports = {
  sendEmail,
  sendLoginEmail,
  sendTeamLeadAssignmentEmail,
  sendTaskAssignedEmail,
  sendTaskRejectionEmail,
  sendTaskModificationEmail,
  sendTaskApprovalEmail,
  sendTeamAssignEmail,
  sendTaskSubmissionEmail ,
  sendTaskApprovalRequestEmail,
  sendTeamMemberAddedEmail
};


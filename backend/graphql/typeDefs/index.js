const { gql } = require("apollo-server-express");
const projectManagerTypeDefs = require("./projectManager");
const leadTypeDefs = require("./teamLead");
const userTypeDefs = require("./user");
const teamTypeDefs = require("./teams");
const memberTypeDefs = require("./member");
const taskTypeDefs = require("./task");
const analyticsTypeDefs = require("./analytics");
const chatTypeDefs = require("./chat");
const meetingTypes = require("./meetings");
const profileTypeDefs = require("./Profile");
const taskSuggestionTypeDefs = require("./taskSuggestion");

const typeDefs = [
  userTypeDefs,
  leadTypeDefs,
  teamTypeDefs,
  memberTypeDefs,
  projectManagerTypeDefs,
  taskTypeDefs,
  analyticsTypeDefs,
  chatTypeDefs,
  meetingTypes,
  profileTypeDefs,
  taskSuggestionTypeDefs
];

module.exports = typeDefs;

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { useQuery, gql } from "@apollo/client";
import { 
  FaUserPlus, 
  FaUsers, 
  FaCalendarAlt, 
  FaEye,
  FaCog,
  FaArrowRight
} from "react-icons/fa";

const GET_TEAM_MEMBERS_BY_TEAM_ID = gql`
  query GetTeamMembersByTeamId($teamId: ID!) {
    getTeamMembersByTeamId(teamId: $teamId) {
      memberRole
      teamMemberId {
        id
        email
        role
        username
      }
    }
  }
`;

const TeamCard = ({ team, projectId, navigate, viewMode = "grid" }) => {
  const { isDark } = useTheme();

  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS_BY_TEAM_ID, {
    variables: { teamId: team.id },
    fetchPolicy: "cache-and-network"
  });

  const members = data?.getTeamMembersByTeamId || [];
  const memberCount = members.length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    navigate(`/teamlead/project/${projectId}/${team.id}`);
  };

  const handleInviteClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking invite button
    // Add invite functionality here
    console.log("Inviting members to team:", team.teamName);
  };

  const handleManageClick = (e) => {
    e.stopPropagation();
    navigate(`/teamlead/project/${projectId}/${team.id}/manage`);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onClick={handleCardClick}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaUsers className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400 transition-colors duration-200">
                  {team.teamName}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3 text-txt-secondary-light dark:text-txt-secondary-dark" />
                    <span className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                      Created {formatDate(team.createdAt)}
                    </span>
                  </div>

                  {/* Show member count */}
                  <div className="flex items-center gap-1">
                    <FaUsers className="w-3 h-3 text-txt-secondary-light dark:text-txt-secondary-dark" />
                    <span className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                      {loading ? "Loading..." : memberCount} member{memberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {team.description && (
                  <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-2 line-clamp-2">
                    {team.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <motion.button
                onClick={handleInviteClick}
                className="btn-secondary flex items-center gap-2 px-4 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserPlus className="w-4 h-4" />
                Invite
              </motion.button>

              <motion.button
                onClick={handleManageClick}
                className="p-2 text-brand-primary-500 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaCog className="w-4 h-4" />
              </motion.button>

              <FaArrowRight className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark group-hover:text-brand-primary-500 transition-colors duration-200" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <FaUsers className="w-6 h-6 text-white" />
            </div>

            <motion.button
              onClick={handleManageClick}
              className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaCog className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {team.teamName}
          </h3>

          <div className="flex items-center gap-2 text-white/80">
            <FaCalendarAlt className="w-3 h-3" />
            <span className="font-body text-sm">
              Created {formatDate(team.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        {team.description ? (
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark line-clamp-3 mb-6 leading-relaxed">
            {team.description}
          </p>
        ) : (
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark italic mb-6">
            No description provided
          </p>
        )}

        {/* Members count only */}
        <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl p-4 text-center mb-6">
          {loading ? (
            <span className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Loading members...
            </span>
          ) : error ? (
            <span className="font-body text-sm text-red-500">
              Error loading members
            </span>
          ) : (
            <>
              <p className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                {memberCount}
              </p>
              <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Member{memberCount !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={handleInviteClick}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaUserPlus className="w-4 h-4" />
            Invite Members
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default TeamCard;

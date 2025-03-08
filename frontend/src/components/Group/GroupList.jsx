import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import CreateGroupPage from "../../pages/Chat/CreateGroup";
import { motion, AnimatePresence } from "framer-motion";

// GraphQL Queries
const GET_GROUPS_BY_LEAD_ID = gql`
  query GetGroupsByLeadId($leadId: ID!) {
    getGroupsByLeadId(leadId: $leadId) {
      id
      name
      teamLead {
        id
        username
      }
      members {
        id
        username
      }
    }
  }
`;

const GET_GROUPS_BY_MEMBER_ID = gql`
  query GetGroupsByMemberId($memberId: ID!) {
    getGroupsByMemberId(memberId: $memberId) {
      id
      name
      teamLead {
        id
        username
      }
      members {
        id
        username
      }
    }
  }
`;

const GroupList = ({ onSelectGroup }) => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const query = userRole === "Team_Lead"  ? GET_GROUPS_BY_LEAD_ID : GET_GROUPS_BY_MEMBER_ID;

  const { data, loading, error } = useQuery(query, {
    skip: !userId,
    variables: { leadId: userId, memberId: userId },
  });

  const groups = userRole === "Team_Lead"  ? data?.getGroupsByLeadId : data?.getGroupsByMemberId;

  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">Your Groups</h2>

      {userRole === "Team_Lead"  && (
        <motion.button
          onClick={() => setShowCreateGroup(true)}
          className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + Create Group
        </motion.button>
      )}

      {loading && <p className="text-center text-gray-500">Loading groups...</p>}
      {error && <p className="text-center text-red-500">Error loading groups.</p>}
      {groups?.length === 0 ? (
        <p className="text-center text-gray-500">No groups found.</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {groups?.map((group) => (
              <motion.li
                key={group.id}
                onClick={() => onSelectGroup(group)}
                className="p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-lg font-medium">{group.name}</h3>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg p-6 bg-white border border-gray-300 rounded-lg shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <CreateGroupPage onClose={() => setShowCreateGroup(false)} />
              <button
                onClick={() => setShowCreateGroup(false)}
                className="w-full px-4 py-2 mt-4 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupList;

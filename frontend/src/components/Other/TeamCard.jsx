import React from "react";
import { FaUserPlus } from "react-icons/fa";

const TeamCard = ({ team, projectId, navigate }) => {
  return (
    <div
      className="p-5 transition bg-white border border-gray-200 shadow-md cursor-pointer rounded-xl hover:shadow-xl hover:-translate-y-1"
      onClick={() => navigate(`/teamlead/project/${projectId}/${team.id}`)}
    >
      <h3 className="text-xl font-semibold text-gray-800">{team.teamName}</h3>
      <p className="mt-1 text-sm text-gray-500">Created {new Date(team.createdAt).toDateString()}</p>
      <p className="mt-3 text-gray-600">{team.description}</p>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500">+ Members</span>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <FaUserPlus /> Invite
        </button>
      </div>
    </div>
  );
};


export default TeamCard;

import React from 'react';

const TeamLeadSelection = ({ teamLead, setTeamLead, teamLeads }) => {
  return (
    <div>
      <label className="block text-gray-700">Select Team Lead</label>
      <div className="flex space-x-4">
        {teamLeads.map((lead) => (
          <div
            key={lead.id}
            className={`flex items-center p-2 border rounded-lg cursor-pointer ${
              teamLead === lead.name ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setTeamLead(lead.name)}
          >
            <img
              src={`https://via.placeholder.com/50`}
              alt={lead.name}
              className="w-8 h-8 mr-2 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{lead.name}</p>
              <p className="text-xs text-gray-600">{lead.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLeadSelection;

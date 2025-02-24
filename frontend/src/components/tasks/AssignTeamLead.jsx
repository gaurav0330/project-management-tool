import React, { useState } from 'react';
import { X } from 'lucide-react';

function AssignTeamLead() {
  const [assignments, setAssignments] = useState({
    'UI Components': null,
    'Design System Documentation': {
      name: 'Alex Rivera',
      role: 'Technical Writer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  });

  const availableLeads = [
    {
      name: 'Sarah Chen',
      role: 'Senior Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      name: 'Mike Johnson',
      role: 'UX Lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      name: 'Alex Rivera',
      role: 'Technical Writer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  ];

  const handleAssignLead = (subsection, lead) => {
    setAssignments(prev => ({
      ...prev,
      [subsection]: lead
    }));
  };

  const handleRemoveAssignment = (subsection) => {
    setAssignments(prev => ({
      ...prev,
      [subsection]: null
    }));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Assign Team Leads</h2>
            <p className="text-sm text-gray-500">Project: Design System Implementation</p>
          </div>
          <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
            Save Assignments
          </button>
        </div>

        <div className="space-y-6">
          {/* Assignment Section */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <h3 className="mb-4 text-sm font-medium text-gray-700">Project Subsection</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">UI Components</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Design System Documentation</span>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <h3 className="mb-4 text-sm font-medium text-gray-700">Available Team Leads</h3>
              <div className="space-y-2">
                {availableLeads.map((lead) => (
                  <div key={lead.name} className="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                       onClick={() => handleAssignLead('UI Components', lead)}>
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="object-cover w-8 h-8 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <h3 className="mb-4 text-sm font-medium text-gray-700">Assigned Team Lead</h3>
              <div className="space-y-2">
                {Object.entries(assignments).map(([subsection, lead]) => (
                  <div key={subsection} className="min-h-[60px] p-2 border border-dashed border-gray-300 rounded-lg">
                    {lead ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={lead.avatar}
                            alt={lead.name}
                            className="object-cover w-8 h-8 rounded-full"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-500">{lead.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAssignment(subsection)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-500">
                        Drag or select lead
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assignment Summary */}
          <div className="pt-6 mt-8 border-t border-gray-200">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Assignment Summary</h3>
            <div className="space-y-3">
              {Object.entries(assignments).map(([subsection, lead]) => (
                lead && (
                  <div key={subsection} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="object-cover w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{subsection}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                      Confirmed
                    </span>
                  </div>
                )
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                Reset All
              </button>
              <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
                Confirm Assignments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTeamLead;

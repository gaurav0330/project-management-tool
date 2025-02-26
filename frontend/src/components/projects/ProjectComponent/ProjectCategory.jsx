import React from 'react';

const ProjectCategory = ({ category, setCategory }) => {
  return (
    <div>
      <label className="block text-gray-700">Project Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value="">Select category</option>
        <option value="Marketing">Marketing</option>
        <option value="Development">Development</option>
        <option value="Design">Design</option>
      </select>
    </div>
  );
};

export default ProjectCategory;

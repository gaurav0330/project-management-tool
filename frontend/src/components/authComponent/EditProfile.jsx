import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { XIcon } from "lucide-react";

const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $userId: ID!
    $availability: String
    $workload: Int
    $skills: [SkillInput!]
    $GithubUsername: String
  ) {
    updateProfile(
      userId: $userId
      availability: $availability
      workload: $workload
      skills: $skills
      GithubUsername: $GithubUsername
    ) {
      GithubUsername
      skills {
        name
        proficiency
      }
      availability
      workload
      createdAt
    }
  }
`;

const proficiencyOptions = ["beginner", "intermediate", "advanced"];
const availabilityOptions = ["available", "busy", "offline"];

export default function EditProfile({ userId, initialProfile, onClose, onUpdated }) {
  const [GithubUsername, setGithubUsername] = useState("");
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState("available");
  const [workload, setWorkload] = useState(0);

  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE, {
    onCompleted(data) {
      if (onUpdated) onUpdated(data.updateProfile);
      onClose();
    },
  });

  useEffect(() => {
    if (initialProfile) {
      setGithubUsername(initialProfile.GithubUsername || "");
      setSkills(
        initialProfile.skills.length
          ? initialProfile.skills
          : [{ name: "", proficiency: "beginner" }]
      );
      setAvailability(initialProfile.availability || "available");
      setWorkload(initialProfile.workload ?? 0);
    }
  }, [initialProfile]);

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { name: "", proficiency: "beginner" }]);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validSkills = skills.filter((s) => s.name.trim() !== "");
    updateProfile({
      variables: {
        userId,
        availability,
        workload: parseInt(workload),
        skills: validSkills,
        GithubUsername,
      },
    });
  };

  

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 w-full max-w-xl mx-4 rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 dark:text-gray-400"
          onClick={onClose}
        >
          <XIcon size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-gray-800 dark:text-gray-100">
          {/* GitHub Username */}
          <div>
            <label className="block mb-1 font-medium">GitHub Username</label>
            <input
              type="text"
              value={GithubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              required
            />
          </div>

          {/* Skills Section */}
          <div>
            <label className="block mb-2 font-medium">Skills</label>
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                  className="flex-1 p-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  required
                />
                <select
                  value={skill.proficiency}
                  onChange={(e) => handleSkillChange(index, "proficiency", e.target.value)}
                  className="p-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                >
                  {proficiencyOptions.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Remove Skill"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              className="text-blue-600 hover:underline mt-2"
            >
              + Add Skill
            </button>
          </div>

          {/* Availability */}
          <div>
            <label className="block mb-1 font-medium">Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Workload */}
          <div>
            <label className="block mb-1 font-medium">Workload (0-100)</label>
            <input
              type="number"
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
              min="0"
              max="100"
              className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm">
              Error: {error.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

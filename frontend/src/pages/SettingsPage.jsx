import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";

// Define GraphQL Mutations
const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

const LEAVE_PROJECT = gql`
  mutation LeaveProject($projectId: ID!) {
    leaveProject(projectId: $projectId)
  }
`;

const DeleteOrLeaveProject = ({ projectId }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Apollo GraphQL Mutations
    const [deleteProject] = useMutation(DELETE_PROJECT);
    const [leaveProject] = useMutation(LEAVE_PROJECT);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUserRole(decodedUser.role);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const handleAction = async () => {
        try {
            if (userRole === "Project_Manager") {
                await deleteProject({ variables: { projectId } });
                alert("Project deleted successfully");
                window.location.href = "/projectDashboard";// Reload after deletion
            } else {
                await leaveProject({ variables: { projectId } });
                alert("You have left the project");
                setShowConfirm(false);
    
                // Redirect Team Lead to /teamleaddashboard
                if (userRole === "Team_Lead") {
                    window.location.href = "/teamleaddashboard";
                } else {
                    window.location.href = "/teammemberdashboard"; // Reload for other roles
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    

    if (!userRole) return null;

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <button
                className={`text-white px-4 py-2 rounded w-full ${
                    userRole === "Project_Manager" ? "bg-red-500" : "bg-yellow-500"
                }`}
                onClick={() => setShowConfirm(true)}
            >
                {userRole === "Project_Manager" ? "Delete This Project" : "Leave This Project"}
            </button>
            {showConfirm && (
                <div className="p-4 border mt-2 bg-gray-100 rounded-lg">
                    <p className="text-red-600 font-semibold">
                        {userRole === "Project_Manager"
                            ? "Are you sure you want to delete this project?"
                            : "Are you sure you want to leave this project?"}
                    </p>
                    <div className="flex justify-end mt-2">
                        <button
                            className={`px-3 py-1 mr-2 rounded ${
                                userRole === "Project_Manager" ? "bg-red-600" : "bg-yellow-600"
                            } text-white`}
                            onClick={handleAction}
                        >
                            {userRole === "Project_Manager" ? "Yes, Delete" : "Yes, Leave"}
                        </button>
                        <button
                            className="bg-gray-300 px-3 py-1 rounded"
                            onClick={() => setShowConfirm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const NotificationSettings = () => {
    const [enabled, setEnabled] = useState(true);
    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <label className="flex items-center mt-2">
                <input type="checkbox" checked={enabled} onChange={() => setEnabled(!enabled)} className="mr-2" />
                <span>Enable Notifications</span>
            </label>
        </div>
    );
};

const RoleManagement = () => {
    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">Manage Team Roles</h3>
            <p className="text-gray-500 mt-2">Feature coming soon...</p>
        </div>
    );
};

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">User Information</h3>
            {user ? (
                <div className="mt-2">
                    <p><strong>Name:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            ) : (
                <p className="text-gray-500 mt-2">User data not available</p>
            )}
        </div>
    );
};

const SettingsPage = ({ projectId }) => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="w-full max-w-lg space-y-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>
                <UserProfile />
                <NotificationSettings />
                <RoleManagement />
                <DeleteOrLeaveProject projectId={projectId} />
            </div>
        </div>
    );
};

export default SettingsPage;

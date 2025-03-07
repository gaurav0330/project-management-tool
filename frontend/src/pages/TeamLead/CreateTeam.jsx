import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { Snackbar, Alert, Button, TextField, Paper, Typography } from "@mui/material";
import { Loader2 } from "lucide-react"; // Ensure `lucide-react` is installed
import { motion } from "framer-motion"; // Ensure `framer-motion` is installed

// ✅ GraphQL Mutation for Creating a Team
const CREATE_TEAM = gql`
  mutation CreateTeam($projectId: ID!, $teamName: String!, $description: String!) {
    createTeam(projectId: $projectId, teamName: $teamName, description: $description) {
      success
      message
      team {
        id
        teamName
        description
      }
    }
  }
`;

const CreateTeam = ({ projectId }) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    console.log("🔍 Debug: Received projectId:", projectId);
    if (!projectId) {
      console.error("❌ Error: projectId is undefined or null!");
    }
  }, [projectId]);

  const [createTeam] = useMutation(CREATE_TEAM);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔍 Debug: Submitting with:", { projectId, teamName, description });

      const { data } = await createTeam({
        variables: {
          projectId: projectId.toString(),
          teamName,
          description,
        },
      });

      console.log("✅ Mutation response:", data);

      if (data.createTeam.success) {
        setSnackbar({ open: true, message: "Team created successfully!", severity: "success" });
        setTeamName("");
        setDescription("");
      } else {
        setSnackbar({ open: true, message: data.createTeam.message || "Failed to create team.", severity: "error" });
      }
    } catch (err) {
      console.error("❌ GraphQL Request Failed:", err);
      setSnackbar({ open: true, message: "Something went wrong!", severity: "error" });
    }

    setLoading(false);
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <Paper className="p-6 rounded-lg shadow-lg">
          <Typography variant="h5" className="mb-2 font-semibold">
            Create New Team
          </Typography>
          <Typography variant="body2" className="mb-4 text-gray-600">
            Set up your team and invite members to collaborate
          </Typography>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit}>
            {/* Team Name Input */}
            <div className="mb-4">
              <TextField
                fullWidth
                label="Team Name *"
                variant="outlined"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              >
                {loading ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        </Paper>
      </motion.div>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateTeam;

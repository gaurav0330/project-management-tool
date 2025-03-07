import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { Snackbar, Alert, Button, TextField } from "@mui/material";

// GraphQL Mutations
const APPROVE_TASK = gql`
  mutation ApproveTaskCompletion($taskId: ID!, $approved: Boolean!, $remarks: String!) {
    approveTaskCompletion(taskId: $taskId, approved: $approved, remarks: $remarks) {
      success
      message
    }
  }
`;

const REJECT_TASK = gql`
  mutation RejectTask($taskId: ID!, $reason: String!) {
    rejectTask(taskId: $taskId, reason: $reason) {
      success
      message
    }
  }
`;

const REQUEST_MODIFICATIONS = gql`
  mutation RequestTaskModifications($taskId: ID!, $feedback: String!) {
    requestTaskModifications(taskId: $taskId, feedback: $feedback) {
      success
      message
    }
  }
`;

export default function Feedback({ taskId }) {
  const [feedback, setFeedback] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(false);

  const [approveTask] = useMutation(APPROVE_TASK);
  const [rejectTask] = useMutation(REJECT_TASK);
  const [requestModifications] = useMutation(REQUEST_MODIFICATIONS);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleAction = async (mutation, variables, successMessage) => {
    setLoading(true);
    try {
      const { data } = await mutation({ variables });
      setSnackbar({ open: true, message: data[Object.keys(data)[0]].message || successMessage, severity: "success" });
      setFeedback(""); // Clear feedback after success
    } catch (error) {
      console.error("Action failed:", error);
      setSnackbar({ open: true, message: "Something went wrong!", severity: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-semibold">Feedback</h3>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Add your feedback here..."
        variant="outlined"
      />

      <div className="flex gap-2 mt-4">
        <Button
          variant="contained"
          color="success"
          disabled={loading}
          onClick={() => handleAction(approveTask, { taskId, approved: true, remarks: feedback }, "Task approved successfully!")}
        >
          ✔ Approve
        </Button>
        <Button
          variant="contained"
          color="warning"
          disabled={loading}
          onClick={() => handleAction(requestModifications, { taskId, feedback }, "Requested modifications successfully!")}
        >
          ⚠ Request Changes
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={() => handleAction(rejectTask, { taskId, reason: feedback }, "Task rejected successfully!")}
        >
          ✖ Reject
        </Button>
      </div>

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
}

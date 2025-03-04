import { useMutation, gql } from "@apollo/client";
import { useState } from "react";

// GraphQL Mutations
const APPROVE_TASK = gql`
  mutation ApproveTaskCompletion($taskId: ID!, $approved: Boolean!, $remarks: String!) {
    approveTaskCompletionByManager(taskId: $taskId, approved: $approved, remarks: $remarks) {
      success
      message
      task {
        id
        status
        history {
          updatedBy
          updatedAt
          oldStatus
          newStatus
        }
      }
    }
  }
`;

const REJECT_TASK = gql`
  mutation RejectTask($taskId: ID!, $reason: String!) {
    rejectTaskByManager(taskId: $taskId, reason: $reason) {
      success
      message
      task {
        id
        title
        status
      }
    }
  }
`;

const REQUEST_MODIFICATIONS = gql`
  mutation RequestTaskModifications($taskId: ID!, $feedback: String!) {
    requestTaskModificationsByManager(taskId: $taskId, feedback: $feedback) {
      success
      message
      task {
        id
        title
        status
      }
    }
  }
`;

export default function Feedback({ taskId }) {
  const [feedback, setFeedback] = useState("");

  const [approveTask] = useMutation(APPROVE_TASK);
  const [rejectTask] = useMutation(REJECT_TASK);
  const [requestModifications] = useMutation(REQUEST_MODIFICATIONS);

  const handleApprove = async () => {
    try {
      const { data } = await approveTask({
        variables: { taskId, approved: true, remarks: feedback },
      });
      alert(data.approveTaskCompletionByManager.message);
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleReject = async () => {
    try {
      const { data } = await rejectTask({
        variables: { taskId, reason: feedback },
      });
      alert(data.rejectTaskByManager.message);
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  const handleRequestChanges = async () => {
    try {
      const { data } = await requestModifications({
        variables: { taskId, feedback },
      });
      alert(data.requestTaskModificationsByManager.message);
    } catch (error) {
      console.error("Request changes failed:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Feedback</h3>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Add your feedback here..."
        className="w-full p-2 border rounded-lg"
      ></textarea>
      <div className="flex gap-2 mt-4">
        <button onClick={handleApprove} className="px-4 py-2 bg-green-500 text-white rounded-lg">
          ✔ Approve
        </button>
        <button onClick={handleRequestChanges} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
          ⚠ Request Changes
        </button>
        <button onClick={handleReject} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          ✖ Reject
        </button>
      </div>
    </div>
  );
}

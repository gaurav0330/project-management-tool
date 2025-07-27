// // Chat.jsx (Main Component - Now Imports the Others)
// import React, { useState, useEffect, useRef } from "react";
// import { useQuery, useMutation } from "@apollo/client";
// import { useAuth } from "../../components/authContext";
// import { jwtDecode } from "jwt-decode";
// import {
//   GET_GROUPS,
//   GET_GROUPS_BY_LEAD,
//   GET_GROUPS_BY_MEMBER,
//   GET_MESSAGES,
//   SEND_MESSAGE,
// } from "../../graphql/chatQueries";
// import toast from 'react-hot-toast';

// // Import Sub-Components
// import GroupList from "../../components/chat/GroupList";
// import ChatHeader from "../../components/chat/ChatHeader";
// import Messages from "../../components/chat/Messages";
// import MessageForm from "../../components/chat/MessageForm";
// import CreateGroupModal from "../../components/chat/CreateGroupModal";

// // Utility: Get initials for each group
// // In Chat.jsx
// const getInitials = (name) =>
//   name
//     ? name
//         .split(" ")
//         .slice(0, 2)
//         .map((w) => w[0])
//         .join("")
//         .toUpperCase()
//     : "??";


// const Chat = ({ projectId }) => {
//   const { userRole } = useAuth();
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [message, setMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setCurrentUser({
//           id: decodedToken.id,
//           username: decodedToken.username,
//           role: decodedToken.role,
//         });
//       } catch (error) {
//         console.error("Token decode error:", error);
//       }
//     }
//   }, []);

//   const getGroupsQuery = () => {
//     if (!currentUser) return GET_GROUPS;
//     switch (userRole) {
//       case "Team_Lead":
//         return GET_GROUPS_BY_LEAD;
//       case "Team_Member":
//         return GET_GROUPS_BY_MEMBER;
//       default:
//         return GET_GROUPS;
//     }
//   };

//   const { data: groupsData, loading: groupsLoading, error: groupsError, refetch: refetchGroups } = useQuery(getGroupsQuery(), {
//     variables:
//       userRole === "Team_Lead" || userRole === "Team_Member"
//         ? {
//             [userRole === "Team_Lead" ? "leadId" : "memberId"]: currentUser?.id,
//             projectId,
//           }
//         : { projectId },
//     skip: !currentUser || !projectId,
//     fetchPolicy: "network-only",
//   });

//   const {
//     data: messagesData,
//     loading: messagesLoading,
//     refetch: refetchMessages,
//   } = useQuery(GET_MESSAGES, {
//     variables: { groupId: selectedGroup?.id },
//     skip: !selectedGroup,
//     pollInterval: 3000,
//     fetchPolicy: "network-only",
//   });

//   const [sendMessage] = useMutation(SEND_MESSAGE, {
//     onCompleted: () => {
//       setMessage("");
//       refetchMessages();
//     },
//     onError: (error) => {
//       console.error("Error sending message:", error);
//       alert("Failed to send message. Please try again.");
//     },
//   });

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesData]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim() || !selectedGroup || !currentUser) return;
//     await sendMessage({
//       variables: { groupId: selectedGroup.id, senderId: currentUser.id, content: message.trim() },
//     });
//   };

//   const handleStartVideoCall = async () => {
//     const meetingId = `${selectedGroup.id}_${Date.now()}`;
//     const meetingUrl = `${window.location.origin}/videocall?meeting=${encodeURIComponent(meetingId)}&group=${selectedGroup.id}`;

//     const vcMsg = `[Video Call Invitation] Join this meeting: ${meetingUrl}`;
//     await sendMessage({
//       variables: { groupId: selectedGroup.id, senderId: currentUser.id, content: vcMsg },
//     });

//     toast.success('Video call invitation sent to the group!');
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(parseInt(timestamp, 10));
//     if (isNaN(date)) return "Invalid";
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const getGroupTypeLabel = (type) => {
//     switch (type) {
//       case "all":
//         return "All Users";
//       case "leads":
//         return "Leads Only";
//       case "team":
//         return "Team";
//       default:
//         return type;
//     }
//   };

//   if (!projectId) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
//         <div className="rounded-2xl shadow-2xl backdrop-blur-xl bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/90 max-w-md p-10 w-full mx-2 font-body text-txt-primary-light dark:text-txt-primary-dark flex flex-col items-center gap-3">
//           <svg width="36" height="36" className="text-error opacity-70 mb-2" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
//           <h2 className="text-2xl font-heading font-bold">Project ID Required</h2>
//           <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
//             Please provide a valid project ID to access chat.
//           </p>
//         </div>
//       </div>
//     );
//   }
//   if (groupsLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
//         <div className="rounded-full h-16 w-16 border-b-4 animate-spin border-interactive-primary-light dark:border-interactive-primary-dark bg-white/60"></div>
//       </div>
//     );
//   }
//   if (groupsError) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
//         <div className="rounded-2xl shadow-xl bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/95 max-w-md p-10 w-full mx-2 font-body text-txt-primary-light dark:text-txt-primary-dark">
//           <h2 className="text-2xl font-heading font-bold text-error mb-1">Error Loading Chat</h2>
//           <p className="text-txt-secondary-light dark:text-txt-secondary-dark">{groupsError.message}</p>
//         </div>
//       </div>
//     );
//   }

//   const groups =
//     groupsData?.getGroups ||
//     groupsData?.getGroupsByLeadId ||
//     groupsData?.getGroupsByMemberId ||
//     [];

//   return (
//     <div className="flex h-screen bg-bg-primary-light dark:bg-bg-primary-dark font-body">
      
// <GroupList
//   groups={groups}
//   selectedGroup={selectedGroup}
//   setSelectedGroup={setSelectedGroup}
//   onCreateGroupClick={() => setIsModalOpen(true)}
//   userRole={userRole}
//   projectId={projectId}
//   getGroupTypeLabel={getGroupTypeLabel}
//   getInitials={getInitials}  // ✅ Ensure this line is present
// />

//       <main className="flex-1 flex flex-col relative">
//         {selectedGroup ? (
//           <>
//             <ChatHeader
//               selectedGroup={selectedGroup}
//               userRole={userRole}
//               handleStartVideoCall={handleStartVideoCall}
//               getGroupTypeLabel={getGroupTypeLabel}
//             />
//             <Messages
//               messagesData={messagesData}
//               messagesLoading={messagesLoading}
//               currentUser={currentUser}
//               formatTime={formatTime}
//             />
//             <div ref={messagesEndRef} />
//             <MessageForm
//               message={message}
//               setMessage={setMessage}
//               handleSendMessage={handleSendMessage}
//               currentUser={currentUser}
//             />
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center px-8 bg-transparent">
//             <div className="bg-bg-secondary-light/70 dark:bg-bg-secondary-dark/80 rounded-3xl p-12 shadow-2xl text-center text-txt-muted-light dark:text-txt-muted-dark w-full max-w-lg mx-auto">
//               <svg width="40" height="40" className="mx-auto mb-3 text-brand-primary-400 dark:text-brand-primary-600 opacity-50" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M7 13h10M7 9h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
//               <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1">Select a Chat Group</h3>
//               <p className="text-base font-body">Choose a group from the sidebar to start chatting</p>
//             </div>
//           </div>
//         )}
//       </main>
//       <CreateGroupModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         projectId={projectId}
//         currentUser={currentUser}
//         refetchGroups={refetchGroups}
//       />
//     </div>
//   );
// };

// export default Chat;

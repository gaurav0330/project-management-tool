// import React, { useState, useEffect, useRef } from "react";
// import { useQuery, useMutation } from "@apollo/client";
// import { useAuth } from "../../components/authContext";
// import { jwtDecode } from "jwt-decode";
// import {
//   GET_GROUPS_BY_MEMBER,
//   GET_MESSAGES,
//   SEND_MESSAGE,
// } from "../../graphql/chatQueries";

// // Helper for avatar initials
// const getInitials = (name) =>
//   name
//     ? name
//         .split(" ")
//         .slice(0, 2)
//         .map((w) => w[0])
//         .join("")
//         .toUpperCase()
//     : "??";

// const TeamMemberChat = ({ projectId }) => {
//   const { userRole } = useAuth();
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [message, setMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Get current user
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

//   // Fetch groups for team member
//   const { data: groupsData, loading: groupsLoading, error: groupsError } = useQuery(
//     GET_GROUPS_BY_MEMBER,
//     {
//       variables: {
//         memberId: currentUser?.id,
//         projectId,
//       },
//       skip: !currentUser || !projectId,
//     }
//   );

//   // Fetch messages for selected group
//   const { data: messagesData, loading: messagesLoading, refetch: refetchMessages } = useQuery(
//     GET_MESSAGES,
//     {
//       variables: { groupId: selectedGroup?.id },
//       skip: !selectedGroup,
//       pollInterval: 3000,
//     }
//   );

//   // Send message
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

//   // Auto-scroll
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

//   const formatTime = (timestamp) =>
//     new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const getGroupTypeLabel = (type) => {
//     switch (type) {
//       case "all": return "All Users";
//       case "leads": return "Leads Only";
//       case "team": return "Team";
//       default: return type;
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

//   const groups = groupsData?.getGroupsByMemberId || [];

//   return (
//     <div className="flex h-screen bg-bg-primary-light dark:bg-bg-primary-dark font-body">
//       {/* Sidebar */}
//       <aside className="min-w-[20rem] max-w-xs w-80 flex flex-col shadow-2xl rounded-r-3xl bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/90 backdrop-blur-xl border-r border-brand-secondary-100 dark:border-brand-secondary-900 relative overflow-y-auto z-20">
//         <div className="p-8 pb-4 border-b border-brand-secondary-100 dark:border-brand-secondary-900 bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/80 flex flex-col gap-2 sticky top-0 z-20">
//           <div className="flex items-center gap-3 mb-1">
//             <span className="text-brand-secondary-600 dark:text-brand-secondary-400 text-3xl">👥</span>
//             <h1 className="font-heading font-bold text-2xl tracking-tight text-heading-primary-light dark:text-heading-primary-dark mb-0.5">
//               Team Member Chat
//             </h1>
//           </div>
//           <span className="text-txt-secondary-light dark:text-txt-secondary-dark text-base opacity-80">
//             Connect with your team
//           </span>
//           {projectId && (
//             <span className="text-xs text-txt-muted-light dark:text-txt-muted-dark font-mono pt-1">
//               Project ID: <span className="font-bold">{projectId}</span>
//             </span>
//           )}
//         </div>
//         <nav className="flex-1 overflow-y-auto py-3 px-2">
//           {groups.length === 0 ? (
//             <div className="p-8 text-center text-txt-muted-light dark:text-txt-muted-dark">
//               <p>No chat groups available</p>
//               <p className="text-sm mt-2">Groups will appear when you're added to teams</p>
//             </div>
//           ) : (
//             groups.map((group) => (
//               <button
//                 key={group.id}
//                 onClick={() => setSelectedGroup(group)}
//                 className={`group w-full mb-2 last:mb-0 flex items-center gap-3 px-4 py-3 rounded-2xl
//                   hover:bg-brand-secondary-50/70 dark:hover:bg-brand-secondary-900/60 hover:shadow-lg border-2 transition-all duration-150
//                   ${
//                     selectedGroup?.id === group.id
//                       ? "border-brand-secondary-600 dark:border-brand-secondary-400 bg-brand-secondary-50/80 dark:bg-brand-secondary-900 shadow"
//                       : "border-transparent bg-transparent"
//                   }
//                   focus:outline-none focus:ring-2 focus:ring-brand-secondary-400
//                 `}
//               >
//                 <span
//                   className={`font-heading font-extrabold text-lg rounded-full w-10 h-10 flex items-center justify-center
//                     ${
//                       selectedGroup?.id === group.id
//                         ? "bg-brand-secondary-600 text-bg-primary-light shadow"
//                         : "bg-brand-secondary-100 dark:bg-brand-secondary-900 text-brand-secondary-700 dark:text-brand-secondary-200"
//                     }
//                     shadow-sm`}
//                 >
//                   {getInitials(group.name)}
//                 </span>
//                 <div className="flex flex-col flex-grow min-w-0">
//                   <span className="font-heading text-base truncate text-heading-primary-light dark:text-heading-primary-dark">
//                     {group.name}
//                   </span>
//                   <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
//                     {getGroupTypeLabel(group.type)} • {group.members?.length || 0} members
//                   </span>
//                 </div>
//                 <span className="ml-2 text-[10px] uppercase tracking-wide text-txt-muted-light dark:text-txt-muted-dark font-bold">
//                   {group.type}
//                 </span>
//               </button>
//             ))
//           )}
//         </nav>
//       </aside>

//       {/* Main Chat Area */}
//       <main className="flex-1 flex flex-col relative">
//         {selectedGroup ? (
//           <>
//             {/* Chat Header */}
//             <header className="sticky top-0 z-10 flex items-center gap-3 bg-bg-secondary-light/80 dark:bg-bg-secondary-dark/90 backdrop-blur-lg border-b border-brand-secondary-100 dark:border-brand-secondary-900 px-10 py-6">
//               <div className="flex-1 flex flex-col gap-1 min-w-0">
//                 <h2 className="text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark truncate">
//                   {selectedGroup.name}
//                 </h2>
//                 <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
//                   {getGroupTypeLabel(selectedGroup.type)} • {selectedGroup.members?.length || 0} members
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap max-w-[300px]">
//                 {selectedGroup.members?.slice(0, 5).map((m) => (
//                   <span
//                     key={m.id}
//                     className="bg-brand-secondary-100 dark:bg-brand-secondary-900 text-brand-secondary-700 dark:text-brand-secondary-200 rounded px-2 py-0.5 text-xs font-mono font-semibold"
//                   >{m.username}</span>
//                 ))}
//                 {selectedGroup.members?.length > 5 && (
//                   <span className="text-xs font-semibold opacity-60">
//                     +{selectedGroup.members.length - 5} more
//                   </span>
//                 )}
//               </div>
//             </header>
//             {/* Messages */}
//             <section className="flex-1 overflow-y-auto px-6 md:px-14 py-8 space-y-6 bg-transparent scrollbar-thin">
//               {messagesLoading ? (
//                 <div className="flex items-center justify-center h-40">
//                   <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-brand-secondary-300 dark:border-brand-secondary-600 border-b-transparent"></div>
//                 </div>
//               ) : messagesData?.getMessages?.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-60 text-txt-muted-light dark:text-txt-muted-dark mt-10">
//                   <svg width="36" height="36" className="mb-2 opacity-50" viewBox="0 0 24 24" fill="none"><path d="M17.657 6.343A8 8 0 206.343 17.657C6.933 16.933 7.885 13.261 11 13c-1.657 1.657 4-5.657 6.657-6.657z" stroke="currentColor" strokeWidth="1.5" /></svg>
//                   <span className="font-heading text-lg font-medium mb-1">No messages yet</span>
//                   <span className="text-sm">Start the conversation!</span>
//                 </div>
//               ) : (
//                 messagesData?.getMessages?.map((msg, idx) => {
//                   const isSelf = msg.sender?.id === currentUser?.id;
//                   const nextMsg = messagesData.getMessages[idx + 1];
//                   const isTail = !nextMsg || nextMsg.sender?.id !== msg.sender?.id;
//                   return (
//                     <div key={msg.id} className={`w-full flex ${isSelf ? "justify-end" : "justify-start"}`}>
//                       <div className={`relative group flex flex-col items-end max-w-[80%] md:max-w-xl ${isSelf ? "items-end" : "items-start"}`}>
//                         <div className={`
//                           relative z-0 shadow-md rounded-3xl px-6 py-3 backdrop-blur-md
//                           text-base font-body whitespace-pre-line break-words transition-all duration-300
//                           ${isSelf
//                             ? "bg-gradient-to-l from-brand-secondary-600 via-brand-secondary-400/95 to-brand-secondary-300/80 text-bg-primary-light"
//                             : "bg-bg-accent-light/80 dark:bg-bg-accent-dark/90 text-txt-primary-light dark:text-txt-primary-dark"
//                           }
//                           ${isSelf ? "ml-10" : "mr-10"}
//                         `}>
//                           <div className="flex items-center gap-3 mb-2">
//                             {isSelf ? (
//                               <span className="hidden md:inline font-heading text-xs uppercase tracking-widest opacity-60">You</span>
//                             ) : (
//                               <span className="font-heading font-medium text-sm text-heading-accent-light dark:text-heading-accent-dark">
//                                 {msg.sender?.username || "Unknown"}
//                               </span>
//                             )}
//                             <span className="text-xs text-txt-muted-light dark:text-txt-muted-dark opacity-70">{formatTime(msg.createdAt)}</span>
//                           </div>
//                           {msg.content}
//                           {/* Chat bubble tail */}
//                           {isTail && (
//                             <span className={`absolute ${isSelf ? "bottom-0 -right-3" : "bottom-0 -left-3"} w-4 h-4 overflow-hidden`}>
//                               <svg width="16" height="16" className={isSelf ? "text-brand-secondary-600" : "text-bg-accent-light dark:text-bg-accent-dark"} viewBox="0 0 16 16" fill="currentColor">
//                                 <polygon points={isSelf ? "16,0 0,16 16,16" : "0,0 16,16 0,16"} />
//                               </svg>
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//               <div ref={messagesEndRef} />
//             </section>
//             {/* Message Input */}
//             <footer className="sticky bottom-0 z-10 bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/95 backdrop-blur-xl border-t border-brand-secondary-100 dark:border-brand-secondary-900 px-10 py-5">
//               <form onSubmit={handleSendMessage} className="flex items-center gap-4">
//                 <input
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Type your message..."
//                   className="flex-1 px-6 py-3 rounded-full border border-brand-secondary-100 dark:border-brand-secondary-900 bg-bg-primary-light/90 dark:bg-bg-primary-dark/80 text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-secondary-300 dark:focus:ring-brand-secondary-500 focus:ring-offset-1 shadow"
//                   disabled={!currentUser}
//                   spellCheck={false}
//                   autoComplete="off"
//                 />
//                 <button
//                   type="submit"
//                   disabled={!message.trim() || !currentUser}
//                   className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-brand-secondary-500 via-brand-secondary-600 to-brand-secondary-700 text-bg-primary-light rounded-full font-button font-semibold shadow-lg transition-all hover:brightness-110 active:scale-95 ring-0 disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   <span>Send</span>
//                   <svg width="20" height="20" fill="none" className="text-bg-primary-light" viewBox="0 0 20 20"><path d="M4 10l10.5-5m0 0L16 10m-1.5-5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
//                 </button>
//               </form>
//             </footer>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center px-8 bg-transparent">
//             <div className="bg-bg-secondary-light/70 dark:bg-bg-secondary-dark/80 rounded-3xl p-12 shadow-2xl text-center text-txt-muted-light dark:text-txt-muted-dark w-full max-w-lg mx-auto">
//               <svg width="40" height="40" className="mx-auto mb-3 text-brand-secondary-400 dark:text-brand-secondary-600 opacity-50" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M7 13h10M7 9h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
//               <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1">Select a Chat Group</h3>
//               <p className="text-base font-body">Choose a group from the sidebar to start chatting</p>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default TeamMemberChat;

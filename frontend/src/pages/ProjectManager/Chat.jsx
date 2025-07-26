import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../../components/authContext";
import {jwtDecode} from "jwt-decode";
import {
  GET_GROUPS,
  GET_GROUPS_BY_LEAD,
  GET_GROUPS_BY_MEMBER,
  GET_MESSAGES,
  SEND_MESSAGE,
} from "../../graphql/chatQueries";

const Chat = ({ projectId }) => {
  const { userRole } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Extract user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUser({
          id: decodedToken.id,
          username: decodedToken.username,
          role: decodedToken.role,
        });
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, []);

  // Determine which query to use based on user role
  const getGroupsQuery = () => {
    if (!currentUser) return GET_GROUPS;

    switch (userRole) {
      case "Team_Lead":
        return GET_GROUPS_BY_LEAD;
      case "Team_Member":
        return GET_GROUPS_BY_MEMBER;
      case "Project_Manager":
      default:
        return GET_GROUPS;
    }
  };

  // Fetch groups based on user role
  const { data: groupsData, loading: groupsLoading, error: groupsError } = useQuery(
    getGroupsQuery(),
    {
      variables:
        userRole === "Team_Lead" || userRole === "Team_Member"
          ? {
              [userRole === "Team_Lead" ? "leadId" : "memberId"]: currentUser?.id,
              projectId: projectId,
            }
          : { projectId: projectId },
      skip: !currentUser || !projectId,
      fetchPolicy: "network-only",
    }
  );

  // Fetch messages for selected group
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery(GET_MESSAGES, {
    variables: { groupId: selectedGroup?.id },
    skip: !selectedGroup,
    pollInterval: 3000,
    fetchPolicy: "network-only",
  });

  // Send message mutation
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessage("");
      refetchMessages();
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    },
  });

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedGroup || !currentUser) return;

    try {
      await sendMessage({
        variables: {
          groupId: selectedGroup.id,
          senderId: currentUser.id,
          content: message.trim(),
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getGroupTypeLabel = (type) => {
    switch (type) {
      case "all":
        return "All Users";
      case "leads":
        return "Leads Only";
      case "team":
        return "Team";
      default:
        return type;
    }
  };

  if (!projectId) {
    return (
      <div className="text-center p-8 font-body text-txt-primary-light dark:text-txt-primary-dark">
        <h2 className="text-xl font-heading font-semibold text-error mb-2 dark:text-error">
          Project ID Required
        </h2>
        <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
          Please provide a valid project ID to access chat.
        </p>
      </div>
    );
  }

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-interactive-primary-light dark:border-interactive-primary-dark"></div>
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="text-center p-8 font-body text-txt-primary-light dark:text-txt-primary-dark">
        <h2 className="text-xl font-heading font-semibold text-error mb-2 dark:text-error">
          Error Loading Chat
        </h2>
        <p className="text-txt-secondary-light dark:text-txt-secondary-dark">{groupsError.message}</p>
      </div>
    );
  }

  const groups =
    groupsData?.getGroups || groupsData?.getGroupsByLeadId || groupsData?.getGroupsByMemberId || [];

  return (
    <div className="flex h-screen bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark font-body">
      {/* Sidebar - Group List */}
      <aside className="w-80 bg-bg-secondary-light dark:bg-bg-secondary-dark border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
            Project Chat
          </h1>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
            {userRole === "Project_Manager"
              ? "Project Manager"
              : userRole === "Team_Lead"
              ? "Team Lead"
              : "Team Member"}{" "}
            View
          </p>
          {projectId && (
            <p className="text-xs text-txt-muted-light dark:text-txt-muted-dark mt-1 truncate">
              Project ID: <span className="font-mono">{projectId}</span>
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-bg-accent-dark scrollbar-track-bg-secondary-dark dark:scrollbar-thumb-bg-accent-light dark:scrollbar-track-bg-secondary-light">
          {groups.length === 0 ? (
            <div className="p-6 text-center text-txt-muted-light dark:text-txt-muted-dark">
              <p>No chat groups available</p>
              <p className="text-sm mt-1">Groups will appear when projects and teams are created</p>
            </div>
          ) : (
            groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 rounded-none hover:bg-bg-accent-light hover:text-interactive-primary-light dark:hover:bg-bg-accent-dark dark:hover:text-interactive-primary-dark transition-colors focus:outline-none ${
                  selectedGroup?.id === group.id
                    ? "bg-bg-accent-light border-l-4 border-brand-primary-500 dark:bg-bg-accent-dark dark:border-brand-primary-400 text-brand-primary-600 dark:text-brand-primary-400 font-semibold"
                    : "text-txt-primary-light dark:text-txt-primary-dark"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-heading text-base">{group.name}</h3>
                    <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-1 truncate max-w-[160px]">
                      {getGroupTypeLabel(group.type)} • {group.members?.length || 0} members
                    </p>
                  </div>
                  <div className="text-xs text-txt-muted-light dark:text-txt-muted-dark uppercase select-none ml-2">
                    {group.type}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            {/* Chat Header */}
            <header className="bg-bg-secondary-light dark:bg-bg-secondary-dark border-b border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-heading-primary-light dark:text-heading-primary-dark truncate max-w-[320px]">
                    {selectedGroup.name}
                  </h2>
                  <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                    {getGroupTypeLabel(selectedGroup.type)} • {selectedGroup.members?.length || 0}{" "}
                    members
                  </p>
                </div>
                <div className="text-xs text-txt-muted-light dark:text-txt-muted-dark max-w-[240px] truncate select-none">
                  {selectedGroup.members?.map((member) => member.username).join(", ")}
                </div>
              </div>
            </header>

            {/* Messages Area */}
            <section className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-bg-accent-dark scrollbar-track-bg-secondary-dark dark:scrollbar-thumb-bg-accent-light dark:scrollbar-track-bg-secondary-light">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-brand-primary-500 dark:border-brand-primary-400"></div>
                </div>
              ) : messagesData?.getMessages?.length === 0 ? (
                <div className="text-center text-txt-muted-light dark:text-txt-muted-dark mt-12">
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start the conversation!</p>
                </div>
              ) : (
                messagesData?.getMessages?.map((msg) => {
                  const isCurrentUser = msg.sender?.id === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-lg px-5 py-3 rounded-lg whitespace-pre-wrap break-words select-text ${
                          isCurrentUser
                            ? "bg-brand-primary-600 text-bg-primary-light font-body"
                            : "bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark font-body"
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-1">
                          <span
                            className={`font-heading text-sm ${
                              isCurrentUser
                                ? "text-bg-primary-light"
                                : "text-heading-primary-light dark:text-heading-primary-dark"
                            }`}
                          >
                            {msg.sender?.username || "Unknown"}
                          </span>
                          <span className="text-xs text-txt-muted-light dark:text-txt-muted-dark">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </section>

            {/* Message Input */}
            <footer className="bg-bg-secondary-light dark:bg-bg-secondary-dark border-t border-gray-200 dark:border-gray-700 p-5">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:outline-none focus:ring-2 focus:ring-interactive-primary-light dark:focus:ring-interactive-primary-dark"
                  disabled={!currentUser}
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || !currentUser}
                  className="px-8 py-3 rounded-lg font-button font-semibold bg-interactive-primary-light dark:bg-interactive-primary-dark text-bg-primary-light hover:bg-interactive-hover-light dark:hover:bg-interactive-hover-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-interactive-primary-light dark:focus:ring-interactive-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
            <div className="text-center text-txt-muted-light dark:text-txt-muted-dark px-6">
              <h3 className="text-lg font-heading font-medium mb-2 text-heading-primary-light dark:text-heading-primary-dark">
                Select a Chat Group
              </h3>
              <p className="text-sm">Choose a group from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;

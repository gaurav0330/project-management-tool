import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../../components/authContext';
import { jwtDecode } from 'jwt-decode';
import { 
  GET_GROUPS, 
  GET_GROUPS_BY_LEAD, 
  GET_GROUPS_BY_MEMBER,
  GET_MESSAGES, 
  SEND_MESSAGE 
} from '../../graphql/chatQueries';

const Chat = ({ projectId }) => {
  const { userRole } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Extract user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
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
      case 'Team_Lead':
        return GET_GROUPS_BY_LEAD;
      case 'Team_Member':
        return GET_GROUPS_BY_MEMBER;
      case 'Project_Manager':
      default:
        return GET_GROUPS;
    }
  };

  // Fetch groups based on user role
  const { data: groupsData, loading: groupsLoading, error: groupsError } = useQuery(
    getGroupsQuery(),
    {
      variables: userRole === 'Team_Lead' || userRole === 'Team_Member' 
        ? { 
            [userRole === 'Team_Lead' ? 'leadId' : 'memberId']: currentUser?.id,
            projectId: projectId
          }
        : { projectId: projectId },
      skip: !currentUser || !projectId
    }
  );

  // Fetch messages for selected group
  const { data: messagesData, loading: messagesLoading, refetch: refetchMessages } = useQuery(
    GET_MESSAGES,
    {
      variables: { groupId: selectedGroup?.id },
      skip: !selectedGroup,
      pollInterval: 3000 // Poll every 3 seconds for real-time updates
    }
  );

  // Send message mutation
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessage('');
      refetchMessages();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedGroup || !currentUser) return;

    try {
      await sendMessage({
        variables: {
          groupId: selectedGroup.id,
          senderId: currentUser.id,
          content: message.trim()
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getGroupTypeLabel = (type) => {
    switch (type) {
      case 'all': return 'All Users';
      case 'leads': return 'Leads Only';
      case 'team': return 'Team';
      default: return type;
    }
  };

  if (!projectId) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Project ID Required</h2>
        <p className="text-gray-600">Please provide a valid project ID to access chat.</p>
      </div>
    );
  }

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Chat</h2>
        <p className="text-gray-600">{groupsError.message}</p>
      </div>
    );
  }

  const groups = groupsData?.getGroups || groupsData?.getGroupsByLeadId || groupsData?.getGroupsByMemberId || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Group List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Project Chat</h1>
          <p className="text-sm text-gray-600 mt-1">
            {userRole === 'Project_Manager' ? 'Project Manager' : 
             userRole === 'Team_Lead' ? 'Team Lead' : 'Team Member'} View
          </p>
          {projectId && (
            <p className="text-xs text-gray-500 mt-1">Project ID: {projectId}</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {groups.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No chat groups available</p>
              <p className="text-sm mt-1">Groups will appear when projects and teams are created</p>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedGroup?.id === group.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{group.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {getGroupTypeLabel(group.type)} • {group.members?.length || 0} members
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {group.type}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{selectedGroup.name}</h2>
                  <p className="text-sm text-gray-600">
                    {getGroupTypeLabel(selectedGroup.type)} • {selectedGroup.members?.length || 0} members
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {selectedGroup.members?.map(member => member.username).join(', ')}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messagesData?.getMessages?.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start the conversation!</p>
                </div>
              ) : (
                messagesData?.getMessages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender?.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender?.id === currentUser?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {msg.sender?.username || 'Unknown'}
                        </span>
                        <span className="text-xs opacity-75">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!currentUser}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || !currentUser}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">Select a Chat Group</h3>
              <p>Choose a group from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

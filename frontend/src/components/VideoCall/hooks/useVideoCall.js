// hooks/useVideoCall.js
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import useWebRTC from './useWebRTC';
import { GET_USER } from '../../../graphql/authQueries';

const useVideoCall = (searchParams) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Get user ID from token/localStorage first
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      
      console.log("🔍 Token from localStorage:", token ? "Found" : "Not found");
      console.log("🔍 User data from localStorage:", stored);
      
      let extractedUserId = null;
      
      if (stored) {
        const userData = JSON.parse(stored);
        extractedUserId = userData.id || userData._id;
      }
      
      if (!extractedUserId && token) {
        try {
          const decodedToken = jwtDecode(token);
          extractedUserId = decodedToken.id || decodedToken.userId;
          console.log("🔑 User ID from token:", extractedUserId);
        } catch (error) {
          console.error("❌ Error decoding token:", error);
        }
      }
      
      if (extractedUserId) {
        setUserId(extractedUserId);
        console.log("✅ User ID set:", extractedUserId);
      } else {
        console.error("❌ No user ID found in localStorage or token");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Error extracting user ID:", error);
      setIsLoading(false);
    }
  }, []);

  // Fetch complete user data using GraphQL
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      console.log("✅ Complete user data fetched:", data.getUser);
      
      const user = data.getUser;
      setUserRole(user.role);
      setCurrentUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });
      
      console.log("👤 Current user set:", {
        id: user.id,
        username: user.username,
        role: user.role
      });
    },
    onError: (error) => {
      console.error("❌ Error fetching user data:", error);
    }
  });

  // Initialize meeting data from URL
  useEffect(() => {
    const meeting = searchParams.get('meeting');
    const group = searchParams.get('group');
    
    console.log("🎯 Meeting ID from URL:", meeting);
    console.log("🎯 Group ID from URL:", group);
    
    if (meeting) {
      setMeetingId(meeting);
      setGroupId(group);
    }
  }, [searchParams]);

  // Set loading state
  useEffect(() => {
    if (!userId) return; // Wait for userId to be set
    
    if (!userLoading && (userData || userError)) {
      setIsLoading(false);
    }
  }, [userId, userLoading, userData, userError]);

  // Initialize WebRTC when call becomes active
  const webRTCData = useWebRTC(meetingId, currentUser, isCallActive);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const startCall = () => {
    console.log("🚀 Starting call with user:", currentUser);
    setIsCallActive(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  return {
    isCallActive,
    callDuration,
    userRole,
    currentUser,
    meetingId,
    groupId,
    isLoading: isLoading || userLoading,
    startCall,
    endCall,
    // Spread WebRTC data
    ...webRTCData
  };
};

export default useVideoCall;

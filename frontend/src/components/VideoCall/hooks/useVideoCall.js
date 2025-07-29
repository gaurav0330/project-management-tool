// hooks/useVideoCall.js - Fixed with socket ready check and improved handling
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  
  // Enhanced state for screen sharing and video controls
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenSharingUser, setScreenSharingUser] = useState(null);
  const [peers, setPeers] = useState(new Map());
  const [meetingMessages, setMeetingMessages] = useState([]);
  const [emojiReactions, setEmojiReactions] = useState([]); // ✅ Emoji reactions state
  
  // ✅ ADD: Track socket ready state
  const [isSocketReady, setIsSocketReady] = useState(false);
  
  // Refs for video elements and streams
  const localVideoRef = useRef(null);
  const localScreenRef = useRef(null);
  const localStreamRef = useRef(null);
  const localScreenStreamRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // Get user ID from token/localStorage first
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      
      console.log("🔍 Token from localStorage:", token ? "Found" : "Not found");
      console.log("🔍 User data from localStorage:", stored);
      
      let extractedUserId = null;
      
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          extractedUserId = userData.id || userData._id;
        } catch (parseError) {
          console.error("❌ Error parsing user data:", parseError);
        }
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

  // ✅ FIXED: Initialize WebRTC when call becomes active - MOVED BEFORE ANY USAGE
  const webRTCData = useWebRTC(meetingId, currentUser, isCallActive);

  // ✅ FIXED: Debug logging - NOW AFTER webRTCData declaration
  useEffect(() => {
    console.log('🔍 WebRTC Data:', {
      hasWebRTCData: !!webRTCData,
      hasSocket: !!(webRTCData && webRTCData.socket),
      socketConnected: webRTCData && webRTCData.socket && webRTCData.socket.connected,
      meetingId,
      currentUser: !!currentUser
    });
  }, [webRTCData, meetingId, currentUser]);

  // ✅ ADD: Set socket ready state
  useEffect(() => {
    const socket = webRTCData?.socket;
    if (socket) {
      if (socket.connected) {
        setIsSocketReady(true);
      } else {
        // Wait for connection
        socket.on('connect', () => {
          console.log('✅ Socket connected successfully');
          setIsSocketReady(true);
        });
      }
    }
  }, [webRTCData?.socket]);

  // Get user media for camera
  const getUserMedia = useCallback(async (constraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Set initial states based on stream tracks
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      
      if (videoTrack) {
        setIsVideoOn(videoTrack.enabled);
      }
      if (audioTrack) {
        setIsAudioOn(audioTrack.enabled);
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return null;
    }
  }, []);

  // Get screen sharing stream
  const getScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100
        }
      });
      
      localScreenStreamRef.current = screenStream;
      
      // Keep camera stream separate when screen sharing
      if (!cameraStreamRef.current && localStreamRef.current) {
        cameraStreamRef.current = localStreamRef.current;
      }

      if (localScreenRef.current) {
        localScreenRef.current.srcObject = screenStream;
      }

      // Listen for screen share end (user clicks stop sharing in browser)
      const videoTrack = screenStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          console.log('Screen share ended by user');
          stopScreenShare();
        };
      }
      
      return screenStream;
    } catch (error) {
      console.error('Error accessing screen share:', error);
      return null;
    }
  }, []);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (localScreenStreamRef.current) {
      localScreenStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localScreenStreamRef.current = null;
    }
    
    if (localScreenRef.current) {
      localScreenRef.current.srcObject = null;
    }
    
    setIsScreenSharing(false);
    setScreenSharingUser(null);
    cameraStreamRef.current = null;
    
    // Notify other participants via WebRTC
    if (webRTCData?.socket) {
      webRTCData.socket.emit('screen-share-stopped', {
        userId: currentUser?.id
      });
    }
  }, [webRTCData, currentUser]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        stopScreenShare();
      } else {
        // Start screen sharing
        const screenStream = await getScreenShare();
        if (screenStream) {
          setIsScreenSharing(true);
          setScreenSharingUser(currentUser?.id);
          
          // Notify other participants via WebRTC
          if (webRTCData?.socket) {
            webRTCData.socket.emit('screen-share-started', {
              userId: currentUser?.id,
              username: currentUser?.username
            });
          }
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  }, [isScreenSharing, getScreenShare, stopScreenShare, currentUser, webRTCData]);

  // Toggle video
  const toggleVideo = useCallback((forceState = null) => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const newState = forceState !== null ? forceState : !videoTrack.enabled;
        videoTrack.enabled = newState;
        setIsVideoOn(newState);
        
        // Notify peers about video state change via WebRTC
        if (webRTCData?.socket) {
          webRTCData.socket.emit('video-toggle', {
            userId: currentUser?.id,
            isVideoOn: newState
          });
        }
      }
    }
  }, [currentUser, webRTCData]);

  // Toggle audio
  const toggleAudio = useCallback((forceState = null) => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        const newState = forceState !== null ? forceState : !audioTrack.enabled;
        audioTrack.enabled = newState;
        setIsAudioOn(newState);
        
        // Notify peers about audio state change via WebRTC
        if (webRTCData?.socket) {
          webRTCData.socket.emit('audio-toggle', {
            userId: currentUser?.id,
            isAudioOn: newState
          });
        }
      }
    }
  }, [currentUser, webRTCData]);

  // ✅ FIXED: sendEmoji with socket ready check
  const sendEmoji = useCallback((emoji) => {
    if (!emoji || !currentUser || !meetingId) {
      console.log('❌ Cannot send emoji: missing data', { emoji, currentUser: !!currentUser, meetingId });
      return;
    }
    
    if (!isSocketReady) {
      console.log('❌ Socket not ready yet - emoji send delayed');
      // Optional: Queue or retry - for now, just log
      return;
    }
    
    const reactionId = `${Date.now()}-${Math.random()}`;
    const reaction = {
      id: reactionId,
      emoji,
      sender: currentUser.username,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      timestamp: new Date(),
      isLocal: true
    };
    
    setEmojiReactions(prev => [...prev, reaction]);
    
    setTimeout(() => {
      setEmojiReactions(prev => prev.filter(r => r.id !== reactionId));
    }, 3000);
    
    const socket = webRTCData?.socket;
    if (socket) {
      console.log('📤 Sending emoji reaction:', { meetingId, emoji, sender: currentUser.username });
      socket.emit('emoji-reaction', {
        meetingId,
        emoji,
        sender: currentUser.username,
        x: reaction.x,
        y: reaction.y,
        timestamp: reaction.timestamp.toISOString()
      });
    } else {
      console.log('❌ No socket available for emoji emit');
    }
  }, [currentUser, webRTCData, meetingId, isSocketReady]);

  // Send meeting message
  const sendMeetingMessage = useCallback((message) => {
    if (!message?.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: currentUser?.username || 'You',
      timestamp: new Date(),
      isLocal: true
    };
    
    setMeetingMessages(prev => [...prev, newMessage]);
    
    // Emit to other participants via WebRTC
    if (webRTCData?.socket) {
      webRTCData.socket.emit('chat-message', {
        text: message.trim(),
        sender: currentUser?.username || 'Anonymous',
        timestamp: newMessage.timestamp
      });
    }
  }, [currentUser, webRTCData]);

  // Convert peers Map to participants array for sidebar
  const participants = useMemo(() => {
    const participantArray = [];
    
    // Add current user
    if (currentUser) {
      participantArray.push({
        id: currentUser.id,
        username: currentUser.username,
        isVideoOn: isVideoOn,
        isAudioOn: isAudioOn,
        isScreenSharing: isScreenSharing,
        isLocal: true
      });
    }
    
    // Add remote peers
    if (peers && peers.size > 0) {
      peers.forEach((peerData, socketId) => {
        participantArray.push({
          id: socketId,
          username: peerData.user?.username || 'Participant',
          isVideoOn: peerData.user?.isVideoOn ?? true,
          isAudioOn: peerData.user?.isAudioOn ?? true,
          isScreenSharing: screenSharingUser === socketId,
          isLocal: false
        });
      });
    }
    
    return participantArray;
  }, [peers, currentUser, isVideoOn, isAudioOn, isScreenSharing, screenSharingUser]);

  // Get participant count
  const participantCount = participants.length;

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCallActive]);

  // Start call with media setup
  const startCall = useCallback(async () => {
    console.log("🚀 Starting call with user:", currentUser);
    
    try {
      const stream = await getUserMedia();
      if (stream) {
        setIsCallActive(true);
        setCallDuration(0);
      } else {
        console.error('Failed to get user media');
      }
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }, [currentUser, getUserMedia]);

  // End call with cleanup including emoji reactions
  const endCall = useCallback(() => {
    // Stop all streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (localScreenStreamRef.current) {
      localScreenStreamRef.current.getTracks().forEach(track => track.stop());
      localScreenStreamRef.current = null;
    }
    
    // Clear refs
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (localScreenRef.current) {
      localScreenRef.current.srcObject = null;
    }
    
    cameraStreamRef.current = null;
    
    // Reset states
    setIsCallActive(false);
    setCallDuration(0);
    setIsScreenSharing(false);
    setScreenSharingUser(null);
    setPeers(new Map());
    setMeetingMessages([]);
    setEmojiReactions([]); // Clear emoji reactions
    setIsVideoOn(true);
    setIsAudioOn(true);
  }, []);

  // ✅ FIXED: Listener with socket ready check
  useEffect(() => {
    const socket = webRTCData?.socket;
    if (!socket || !isSocketReady) return;

    const handleEmojiReaction = ({ emoji, sender, x, y, timestamp }) => {
      console.log('📥 Received emoji reaction:', { emoji, sender, x, y });
      
      const reactionId = `${timestamp}-${sender}-${Math.random()}`;
      const reaction = {
        id: reactionId,
        emoji,
        sender,
        x,
        y,
        timestamp: new Date(timestamp),
        isLocal: false
      };
      
      setEmojiReactions(prev => [...prev, reaction]);
      
      setTimeout(() => {
        setEmojiReactions(prev => prev.filter(r => r.id !== reactionId));
      }, 3000);
    };

    socket.on('emoji-reaction', handleEmojiReaction);

    return () => {
      socket.off('emoji-reaction', handleEmojiReaction);
    };
  }, [webRTCData?.socket, isSocketReady]);

  return {
    // Original properties
    isCallActive,
    callDuration,
    userRole,
    currentUser,
    meetingId,
    groupId,
    isLoading: isLoading || userLoading,
    startCall,
    endCall,
    
    // Enhanced properties for screen sharing and controls
    peers,
    isVideoOn,
    isAudioOn,
    isScreenSharing,
    screenSharingUser,
    meetingMessages,
    participants,
    participantCount,
    
    // Emoji functionality
    emojiReactions,
    sendEmoji,
    
    // Refs
    localVideoRef,
    localScreenRef,
    
    // Streams
    localStream: localStreamRef.current,
    localScreenStream: localScreenStreamRef.current,
    cameraStream: cameraStreamRef.current,
    
    // Action functions
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    sendMeetingMessage,
    getUserMedia,
    
    // Spread WebRTC data (socket, etc.)
    ...webRTCData
  };
};

export default useVideoCall;

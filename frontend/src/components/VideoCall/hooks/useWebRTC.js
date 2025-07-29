// hooks/useWebRTC.js - Complete Native WebRTC Implementation with Screen Sharing and Proper Socket Return
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useScreenShare from './useScreenShare'; // ✅ ADD THIS

const useWebRTC = (meetingId, currentUser, isCallActive) => {
  const [peers, setPeers] = useState(new Map());
  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [meetingMessages, setMeetingMessages] = useState([]);
  const [screenSharingUser, setScreenSharingUser] = useState(null); // ✅ ADD THIS
  
  const socketRef = useRef();
  const peersRef = useRef(new Map());
  const localVideoRef = useRef();
  const streamPromiseRef = useRef(null);

  // ✅ ADD THIS: Initialize screen sharing hook
  const screenShareHook = useScreenShare(
    localVideoRef, 
    socketRef, 
    meetingId, 
    peers, 
    setPeers
  );

  // WebRTC configuration
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const initializeLocalStream = async () => {
    try {
      console.log('🎥 Requesting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('✅ Local stream obtained:', stream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to existing peer connections
      console.log('🔄 Adding local stream to existing peer connections...');
      peersRef.current.forEach((peerConnection, socketId) => {
        console.log(`📤 Adding stream tracks to existing peer:`, socketId);
        stream.getTracks().forEach(track => {
          const senders = peerConnection.getSenders();
          const existingSender = senders.find(sender => sender.track && sender.track.id === track.id);
          if (!existingSender) {
            peerConnection.addTrack(track, stream);
          } else {
            console.log(`📤 Track ${track.kind} already added for ${socketId}`);
          }
        });
      });

      return stream;
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      return null;
    }
  };

  const createPeerConnection = async (socketId, user, isInitiator) => {
    try {
      console.log(`🔗 Creating peer connection with ${user.username} (initiator: ${isInitiator})`);
      
      const peerConnection = new RTCPeerConnection(rtcConfiguration);

      // Set up ontrack handler FIRST
      peerConnection.ontrack = (event) => {
        console.log(`🎉 ONTRACK EVENT FIRED from ${user.username}!`);
        console.log('📺 Stream details:', event.streams[0]);
        console.log('📺 Stream active:', event.streams[0].active);
        console.log('📺 Stream tracks:', event.streams[0].getTracks().map(t => `${t.kind}: ${t.enabled}`));
        
        const [remoteStream] = event.streams;
        
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.set(socketId, { 
            peerConnection, 
            stream: remoteStream, 
            user 
          });
          console.log(`✅ Peer added to state. Total peers:`, newPeers.size);
          console.log(`🗺️ Peers map keys:`, Array.from(newPeers.keys()));
          return newPeers;
        });
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`🧊 Sending ICE candidate to ${user.username}:`, event.candidate.type);
          socketRef.current?.emit('webrtc-signal', {
            meetingId,
            to: socketId,
            signal: event.candidate,
            type: 'ice-candidate'
          });
        } else {
          console.log(`🧊 ICE gathering complete for ${user.username}`);
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(`🔄 Connection state with ${user.username}:`, peerConnection.connectionState);
        
        if (peerConnection.connectionState === 'connected') {
          console.log(`✅ Successfully connected to ${user.username}`);
        } else if (peerConnection.connectionState === 'failed') {
          console.log(`❌ Connection failed with ${user.username}, attempting restart`);
          peerConnection.restartIce();
        }
      };

      // Handle ICE connection state
      peerConnection.oniceconnectionstatechange = () => {
        console.log(`🧊 ICE connection state with ${user.username}:`, peerConnection.iceConnectionState);
      };

      // Store peer connection
      peersRef.current.set(socketId, peerConnection);

      // ✅ CRITICAL FIX: Use promise to wait for localStream
      let currentStream = localStream;
      if (!currentStream) {
        console.log(`⏳ Waiting for local stream for ${user.username}...`);
        currentStream = await streamPromiseRef.current;
        if (!currentStream) {
          console.error(`❌ No local stream available for ${user.username} after waiting!`);
          return;
        }
      }

      console.log(`📤 Adding local stream tracks to peer connection with ${user.username}`);
      currentStream.getTracks().forEach(track => {
        console.log(`📤 Adding track:`, track.kind, track.enabled, track.readyState);
        const sender = peerConnection.addTrack(track, currentStream);
        console.log(`📤 Track sender created:`, !!sender);
      });

      // Create offer if initiator
      if (isInitiator) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log(`📤 Creating offer for ${user.username}`);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        console.log(`📤 Sending offer to ${user.username}:`, offer.type);
        socketRef.current?.emit('webrtc-signal', {
          meetingId,
          to: socketId,
          signal: offer,
          type: 'offer'
        });
      }

    } catch (error) {
      console.error('❌ Error creating peer connection:', error);
    }
  };

  useEffect(() => {
    console.log("🎯 useWebRTC initialized with:", { meetingId, currentUser, isCallActive });
    
    if (!meetingId || !currentUser || !isCallActive) {
      console.log("❌ Missing required data for WebRTC:", { meetingId, currentUser, isCallActive });
      return;
    }

    console.log("🔌 Connecting to socket server...");
    
   const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_WS_URL || "wss://your-backend-app.onrender.com"
    : "http://localhost:5000";

socketRef.current = io(SOCKET_URL);// ✅ FIXED: Use your actual server URL (replace if needed)

    // ✅ ADD: Connect event handler
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
      // Join room or other init logic
      socketRef.current.emit('join-video-room', { meetingId, user: currentUser });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    // Initialize stream and join room
    const initializeStreamAndJoin = async () => {
      console.log('🎥 Initializing local stream before joining room...');
      streamPromiseRef.current = initializeLocalStream();
      const stream = await streamPromiseRef.current;
      
      if (!stream) {
        console.error('❌ Failed to get local stream, cannot join room');
        return;
      }

      // Join the video room AFTER stream is ready
      socketRef.current.emit('join-video-room', {
        meetingId,
        user: currentUser,
        groupId: meetingId.split('_')[0]
      });
    };

    initializeStreamAndJoin();

    // Listen for existing participants
    socketRef.current.on('existing-participants', (existingParticipants) => {
      console.log('📋 Existing participants:', existingParticipants);
      
      existingParticipants.forEach(({ socketId, user }) => {
        createPeerConnection(socketId, user, true);
      });
      
      setParticipants(existingParticipants);
      setParticipantCount(existingParticipants.length + 1);
    });

    // Listen for new users joining
    socketRef.current.on('user-joined-video', ({ socketId, user }) => {
      console.log('👤 User joined:', user);
      createPeerConnection(socketId, user, false);
      
      setParticipants(prev => [...prev, { socketId, user }]);
    });

    // ✅ ADD THESE: Screen sharing event listeners
    socketRef.current.on('user-started-screen-share', ({ socketId }) => {
      console.log('🖥️ User started screen sharing:', socketId);
      setScreenSharingUser(socketId);
      
      // Update participants to show who's sharing
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId 
            ? { ...p, user: { ...p.user, isScreenSharing: true } }
            : { ...p, user: { ...p.user, isScreenSharing: false } }
        )
      );
    });

    socketRef.current.on('user-stopped-screen-share', ({ socketId }) => {
      console.log('🛑 User stopped screen sharing:', socketId);
      setScreenSharingUser(null);
      
      // Update participants
      setParticipants(prev => 
        prev.map(p => ({ 
          ...p, 
          user: { ...p.user, isScreenSharing: false } 
        }))
      );
    });

    // Handle WebRTC signaling
    socketRef.current.on('webrtc-signal', async ({ from, signal, type }) => {
      console.log(`📡 Received ${type} from ${from}`);
      
      const peerConnection = peersRef.current.get(from);
      if (!peerConnection) {
        console.error('⚠️ No peer connection found for:', from);
        return;
      }

      try {
        if (type === 'offer') {
          console.log(`📥 Processing offer from ${from}`);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
          
          if (localStream) {
            console.log(`📤 Adding local tracks before creating answer for ${from}`);
            const senders = peerConnection.getSenders();
            
            localStream.getTracks().forEach(track => {
              const existingSender = senders.find(sender => sender.track && sender.track.id === track.id);
              if (!existingSender) {
                console.log(`📤 Adding ${track.kind} track to ${from}`);
                peerConnection.addTrack(track, localStream);
              } else {
                console.log(`📤 Track ${track.kind} already added to ${from}`);
              }
            });
          } else {
            console.error(`❌ No local stream available for answer to ${from}!`);
          }
          
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          console.log(`📤 Sending answer to ${from}`);
          socketRef.current.emit('webrtc-signal', {
            meetingId,
            to: from,
            signal: answer,
            type: 'answer'
          });
        } else if (type === 'answer') {
          console.log(`📥 Processing answer from ${from}`);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (type === 'ice-candidate') {
          console.log(`📥 Processing ICE candidate from ${from}:`, signal.type || 'candidate');
          await peerConnection.addIceCandidate(new RTCIceCandidate(signal));
        }
      } catch (error) {
        console.error(`❌ Error handling ${type}:`, error);
      }
    });

    // Handle user leaving
    socketRef.current.on('user-left-video', ({ socketId }) => {
      console.log('👋 User left:', socketId);
      
      const peerConnection = peersRef.current.get(socketId);
      if (peerConnection) {
        peerConnection.close();
        peersRef.current.delete(socketId);
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.delete(socketId);
          return newPeers;
        });
      }
      
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    });

    // Handle participant count updates
    socketRef.current.on('participant-count-updated', ({ count }) => {
      setParticipantCount(count);
    });

    // Handle audio/video state changes
    socketRef.current.on('participant-audio-changed', ({ socketId, isAudioOn }) => {
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId 
            ? { ...p, user: { ...p.user, isAudioOn } }
            : p
        )
      );
    });

    socketRef.current.on('participant-video-changed', ({ socketId, isVideoOn }) => {
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId 
            ? { ...p, user: { ...p.user, isVideoOn } }
            : p
        )
      );

      // ✅ Also update peers
      setPeers(prev => {
        const newPeers = new Map(prev);
        const peerData = newPeers.get(socketId);
        if (peerData) {
          newPeers.set(socketId, {
            ...peerData,
            user: {
              ...peerData.user,
              isVideoOn
            }
          });
        }
        return newPeers;
      });
    });

    // Handle meeting messages
    socketRef.current.on('meeting-message-received', (message) => {
      setMeetingMessages(prev => [...prev, message]);
    });

    return () => {
      console.log('🧹 Cleaning up WebRTC resources...');
      
      if (socketRef.current) {
        socketRef.current.emit('leave-video-room', { meetingId });
        socketRef.current.disconnect();
      }
      
      peersRef.current.forEach(pc => {
        if (pc.connectionState !== 'closed') {
          pc.close();
        }
      });
      peersRef.current.clear();
      
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [meetingId, currentUser, isCallActive]);

  const toggleAudio = (isAudioOn) => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isAudioOn;
      });
      
      socketRef.current?.emit('toggle-audio', { meetingId, isAudioOn });
    }
  };

  const toggleVideo = (isVideoOn) => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
      
      socketRef.current?.emit('toggle-video', { meetingId, isVideoOn });
    }
  };

  const sendMeetingMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit('send-meeting-message', {
        meetingId,
        message,
        user: currentUser
      });
    }
  };

  return {
    socket: socketRef.current, // ✅ FIXED: Return the socket reference
    peers,
    localStream,
    localVideoRef,
    participants,
    participantCount,
    meetingMessages,
    toggleAudio,
    toggleVideo,
    sendMeetingMessage,
    screenSharingUser, // ✅ ADD THIS
    ...screenShareHook // ✅ ADD THIS: Spread screen sharing functions
  };
};

export default useWebRTC;

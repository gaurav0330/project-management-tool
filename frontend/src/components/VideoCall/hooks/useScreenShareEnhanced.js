// hooks/useScreenShareEnhanced.js
import { useState, useRef, useCallback } from 'react';

const useScreenShareEnhanced = (localVideoRef, socketRef, meetingId) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const screenStreamRef = useRef(null);
  const originalStreamRef = useRef(null);

  const startScreenShare = useCallback(async () => {
    try {
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true
      });

      // Store original camera stream
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        originalStreamRef.current = localVideoRef.current.srcObject;
        setCameraStream(localVideoRef.current.srcObject);
      }

      // Set screen stream to main video
      screenStreamRef.current = screenStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // Handle screen share ending
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      setIsScreenSharing(true);

      // Notify other participants
      if (socketRef.current) {
        socketRef.current.emit('start-screen-share', { meetingId });
      }

      // Replace peer connection tracks with screen share
      // This would need to be implemented in your WebRTC logic

      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return null;
    }
  }, [localVideoRef, socketRef, meetingId]);

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

    // Restore camera stream
    if (originalStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = originalStreamRef.current;
    }

    setIsScreenSharing(false);
    setCameraStream(null);

    // Notify other participants
    if (socketRef.current) {
      socketRef.current.emit('stop-screen-share', { meetingId });
    }
  }, [localVideoRef, socketRef, meetingId]);

  return {
    isScreenSharing,
    cameraStream,
    startScreenShare,
    stopScreenShare
  };
};

export default useScreenShareEnhanced;

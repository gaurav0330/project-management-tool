// hooks/useScreenShare.js
import { useState, useRef } from 'react';

const useScreenShare = (localVideoRef, socketRef, meetingId, peers, setPeers) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [originalStream, setOriginalStream] = useState(null);
  const screenStreamRef = useRef(null);

  const startScreenShare = async () => {
    try {
      console.log('🖥️ Starting screen share...');
      
      // Store original camera stream
      if (localVideoRef.current?.srcObject && !originalStream) {
        setOriginalStream(localVideoRef.current.srcObject);
      }

      // Get screen capture stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { max: 1920 },
          height: { max: 1080 },
          frameRate: { max: 30 }
        },
        audio: true // Include system audio if available
      });

      screenStreamRef.current = screenStream;
      console.log('✅ Screen stream obtained:', screenStream.getTracks().map(t => `${t.kind}: ${t.enabled}`));

      // Update local video display
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      if (videoTrack) {
        // Update all existing peer connections
        for (const [socketId, peerData] of peers.entries()) {
          const peerConnection = peerData.peerConnection;
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender) {
            await sender.replaceTrack(videoTrack);
            console.log(`📤 Screen track replaced for peer: ${socketId}`);
          }
        }
      }

      // Handle screen share ending (user clicks browser's "Stop sharing" button)
      videoTrack.onended = () => {
        console.log('🛑 Screen share ended by user');
        stopScreenShare();
      };

      // Notify other participants
      socketRef.current?.emit('start-screen-share', { meetingId });
      
      setIsScreenSharing(true);
      console.log('🎉 Screen sharing started successfully');

    } catch (error) {
      console.error('❌ Error starting screen share:', error);
      
      // Handle user cancellation gracefully
      if (error.name === 'NotAllowedError') {
        console.log('ℹ️ User cancelled screen sharing');
      } else {
        alert('Failed to start screen sharing. Please try again.');
      }
    }
  };

  const stopScreenShare = async () => {
    try {
      console.log('🛑 Stopping screen share...');

      // Stop screen stream tracks
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        screenStreamRef.current = null;
      }

      // Restore original camera stream
      if (originalStream) {
        // Update local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = originalStream;
        }

        // Replace screen track back to camera track in all peer connections
        const videoTrack = originalStream.getVideoTracks()[0];
        if (videoTrack) {
          for (const [socketId, peerData] of peers.entries()) {
            const peerConnection = peerData.peerConnection;
            const sender = peerConnection.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );
            
            if (sender) {
              await sender.replaceTrack(videoTrack);
              console.log(`📤 Camera track restored for peer: ${socketId}`);
            }
          }
        }
      }

      // Notify other participants
      socketRef.current?.emit('stop-screen-share', { meetingId });
      
      setIsScreenSharing(false);
      console.log('✅ Screen sharing stopped successfully');

    } catch (error) {
      console.error('❌ Error stopping screen share:', error);
    }
  };

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  return {
    isScreenSharing,
    toggleScreenShare,
    startScreenShare,
    stopScreenShare
  };
};

export default useScreenShare;

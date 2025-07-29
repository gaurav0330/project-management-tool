// components/DualStreamManager.jsx
import { useEffect, useRef, useState } from 'react';

const DualStreamManager = ({ 
  localVideoRef, 
  isScreenSharing, 
  onStreamUpdate,
  socketRef,
  meetingId,
  peers,
  setPeers 
}) => {
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const originalCameraStream = useRef(null);

  // Get user media for camera
  const getCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setCameraStream(stream);
      originalCameraStream.current = stream;
      return stream;
    } catch (error) {
      console.error('Error getting camera stream:', error);
      return null;
    }
  };

  // Get display media for screen sharing
  const getScreenStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      setScreenStream(stream);
      
      // Handle screen share ending
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        onStreamUpdate?.(originalCameraStream.current, 'camera');
      };
      
      return stream;
    } catch (error) {
      console.error('Error getting screen stream:', error);
      return null;
    }
  };

  // Switch between camera and screen
  useEffect(() => {
    const handleStreamSwitch = async () => {
      if (isScreenSharing) {
        // Start screen sharing but keep camera active
        const screenStream = await getScreenStream();
        if (screenStream) {
          // Update main video display to screen
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          
          // Send screen stream to peers
          onStreamUpdate?.(screenStream, 'screen');
          
          // Keep camera stream active for sidebar
          if (!cameraStream) {
            await getCameraStream();
          }
        }
      } else {
        // Switch back to camera
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
        
        if (cameraStream && localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream;
          onStreamUpdate?.(cameraStream, 'camera');
        }
      }
    };

    handleStreamSwitch();
  }, [isScreenSharing]);

  // Initialize camera stream on mount
  useEffect(() => {
    if (!cameraStream && !isScreenSharing) {
      getCameraStream();
    }
  }, []);

  return {
    cameraStream,
    screenStream,
    getCameraStream,
    getScreenStream
  };
};

export default DualStreamManager;

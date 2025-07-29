// components/PreCallSetup.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Settings, Camera } from 'lucide-react';

const PreCallSetup = ({ currentUser, onStartCall, localVideoRef }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const previewVideoRef = useRef(null);
  const streamRef = useRef(null);

   const emojiAnimationStyles = `
    @keyframes emojiFloat {
      0% {
        opacity: 1;
        transform: translateY(0) scale(0.5);
      }
      20% {
        transform: translateY(-20px) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-100px) scale(0.8);
      }
    }
    
    .emoji-float {
      animation: emojiFloat 3s ease-out forwards;
    }
  `;
  
  useEffect(() => {
    initializePreviewCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializePreviewCamera = async () => {
    try {
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false
      });
      
      streamRef.current = stream;
      
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera for preview:', error);
      setCameraError(error.message);
      setIsVideoOn(false);
    }
  };

  const toggleVideo = () => {
    const newVideoState = !isVideoOn;
    setIsVideoOn(newVideoState);
    
    if (newVideoState && !streamRef.current) {
      initializePreviewCamera();
    } else if (!newVideoState && streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = null;
      }
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleStartCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    onStartCall();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-bg-secondary-light/70 dark:bg-bg-secondary-dark/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20">
        <div className="relative mb-8 rounded-2xl overflow-hidden bg-gray-900 aspect-video">
          {cameraError ? (
            <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-brand-primary-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <p className="text-white text-sm text-center px-4">
                Camera unavailable: {cameraError}
              </p>
            </div>
          ) : (
            <video
              ref={previewVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          )}
          
          {!isVideoOn && !cameraError && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="w-20 h-20 bg-brand-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={toggleVideo}
              className={`rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all ${
                isVideoOn 
                  ? "bg-bg-accent-light/80 dark:bg-bg-accent-dark/80 text-txt-primary-light dark:text-txt-primary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark" 
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={toggleMute}
              className={`rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all ${
                !isMuted 
                  ? "bg-bg-accent-light/80 dark:bg-bg-accent-dark/80 text-txt-primary-light dark:text-txt-primary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark" 
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {!isMuted ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Ready to Join?
            </h2>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Join the video conference with your team
            </p>
          </div>

          <button
            onClick={handleStartCall}
            className="bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
          >
            <Video className="w-5 h-5" />
            Join Meeting
          </button>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button 
              onClick={initializePreviewCamera}
              className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark transition-colors"
            >
              <Camera className="w-4 h-4" />
              Test Camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreCallSetup;

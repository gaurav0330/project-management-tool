// components/CallControls.jsx
import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, MoreVertical } from 'lucide-react';

const CallControls = ({ 
  isMuted, 
  isVideoOn, 
  isScreenSharing, 
  onToggleMute, 
  onToggleVideo, 
  onToggleScreenShare, 
  onEndCall 
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-gray-200/20 dark:border-gray-700/20">
      <button
        onClick={onToggleMute}
        className={`rounded-full w-12 h-12 p-0 transition-all flex items-center justify-center ${
          !isMuted 
            ? "bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-brand-accent-100 dark:hover:bg-brand-accent-800" 
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {!isMuted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`rounded-full w-12 h-12 p-0 transition-all flex items-center justify-center ${
          isVideoOn 
            ? "bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-brand-accent-100 dark:hover:bg-brand-accent-800" 
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </button>

      <button
        onClick={onToggleScreenShare}
        className={`rounded-full w-12 h-12 p-0 transition-all flex items-center justify-center ${
          !isScreenSharing 
            ? "bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-brand-accent-100 dark:hover:bg-brand-accent-800" 
            : "bg-brand-accent-600 text-white hover:bg-brand-accent-700"
        }`}
      >
        <ScreenShare className="w-5 h-5" />
      </button>

      <button
        onClick={onEndCall}
        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 p-0 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center"
      >
        <PhoneOff className="w-5 h-5" />
      </button>

      <button className="bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-brand-accent-100 dark:hover:bg-brand-accent-800 rounded-full w-12 h-12 p-0 transition-all flex items-center justify-center">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CallControls;

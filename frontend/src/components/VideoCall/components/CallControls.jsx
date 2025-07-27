// components/CallControls.jsx - Add screen sharing button
import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Monitor, 
  MonitorOff 
} from 'lucide-react';

const CallControls = ({ 
  isMuted, 
  isVideoOn, 
  isScreenSharing, // ✅ ADD THIS
  onToggleMute, 
  onToggleVideo, 
  onToggleScreenShare, // ✅ ADD THIS
  onEndCall 
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border border-gray-700/50">
        <div className="flex items-center gap-4">
          {/* Microphone Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
              !isVideoOn 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* ✅ ADD THIS: Screen Share Toggle */}
          <button
            onClick={onToggleScreenShare}
            className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
              isScreenSharing 
                ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-400' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
            title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
          >
            {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-lg"
            title="End call"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallControls;

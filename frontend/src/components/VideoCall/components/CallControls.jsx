// components/CallControls.jsx - Enhanced with screen sharing
import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor,
  MonitorOff, 
  Phone, 
  Users, 
  MessageSquare,
  Settings,
  MoreVertical
} from 'lucide-react';

const CallControls = ({
  isMuted,
  isVideoOn,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  showParticipants,
  showChat,
  onToggleParticipants,
  onToggleChat,
  participantCount = 0
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border border-gray-700/50">
        <div className="flex items-center gap-3">
          {/* Audio Control */}
          <button
            onClick={onToggleMute}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Control */}
          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-xl transition-all duration-200 ${
              !isVideoOn 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share Control */}
          <button
            onClick={onToggleScreenShare}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isScreenSharing 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-600"></div>

          {/* Participants */}
          <button
            onClick={onToggleParticipants}
            className={`p-3 rounded-xl transition-all duration-200 relative ${
              showParticipants 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title="Toggle participants"
          >
            <Users className="w-5 h-5" />
            {participantCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {participantCount > 9 ? '9+' : participantCount}
              </span>
            )}
          </button>

          {/* Chat */}
          <button
            onClick={onToggleChat}
            className={`p-3 rounded-xl transition-all duration-200 ${
              showChat 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title="Toggle chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* More Options */}
          <button
            className="p-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-600"></div>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
            title="End call"
          >
            <Phone className="w-5 h-5 rotate-135" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallControls;
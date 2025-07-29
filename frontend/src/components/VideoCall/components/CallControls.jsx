// components/CallControls.jsx - Enhanced with screen sharing and emoji reactions
import React, { useState } from 'react';
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
  MoreVertical,
  Smile // ✅ NEW: Import emoji icon
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
  participantCount = 0,
  onSendEmoji // ✅ NEW: Add emoji prop
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // ✅ NEW

  // ✅ NEW: Emoji options
  const quickEmojis = ['👍', '👎', '❤️', '😂', '😮', '😢', '👏', '🎉'];

  const handleEmojiClick = (emoji) => {
    console.log('🎯 Emoji clicked:', emoji);
    if (onSendEmoji) {
      onSendEmoji(emoji); // ✅ CALL THE FUNCTION
    } else {
      console.log('❌ onSendEmoji function not provided');
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      {/* ✅ NEW: Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-gray-700/50">
          <div className="grid grid-cols-4 gap-2">
            {quickEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-2 text-2xl hover:bg-gray-700 rounded-lg transition-colors"
                title={`Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

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

          {/* ✅ NEW: Emoji Control */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              showEmojiPicker 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title="Send emoji reaction"
          >
            <Smile className="w-5 h-5" />
          </button>

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

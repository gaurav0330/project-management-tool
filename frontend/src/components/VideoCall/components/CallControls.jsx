// components/CallControls.jsx - Enhanced with screen sharing, emoji reactions, movable functionality, improved icon contrast, increased spacing, and bounds checking to stay within screen
import React, { useState, useRef } from 'react';
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
  Smile, // ✅ Import emoji icon
  GripVertical // ✅ Import grip icon for drag handle (from lucide-react)
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
  onSendEmoji // ✅ Add emoji prop
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 }); // ✅ NEW: Store bounds for clamping

  // Emoji options
  const quickEmojis = ['👍', '👎', '❤️', '😂', '😮', '😢', '👏', '🎉'];

  const handleEmojiClick = (emoji) => {
    console.log('🎯 Emoji clicked:', emoji);
    if (onSendEmoji) {
      onSendEmoji(emoji);
    } else {
      console.log('❌ onSendEmoji function not provided');
    }
    setShowEmojiPicker(false);
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    // ✅ NEW: Calculate bounds on mouse down
    if (dragRef.current) {
      const control = dragRef.current;
      const controlWidth = control.offsetWidth;
      const controlHeight = control.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const bottomRem = 1.5; // From bottom: '1.5rem'
      const bottomPx = bottomRem * remSize;
      const baseTop = viewportHeight - bottomPx - controlHeight;
      const baseLeft = (viewportWidth / 2) - (controlWidth / 2);
      boundsRef.current = {
        minX: -baseLeft,
        maxX: viewportWidth - controlWidth - baseLeft,
        minY: -baseTop,
        maxY: viewportHeight - controlHeight - baseTop,
      };
    }

    e.preventDefault(); // Prevent text selection
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    let newX = e.clientX - dragStartRef.current.x;
    let newY = e.clientY - dragStartRef.current.y;

    // ✅ NEW: Clamp position to bounds
    const { minX, maxX, minY, maxY } = boundsRef.current;
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse move/up listeners when dragging starts
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={dragRef}
      className="absolute z-20"
      style={{
        left: '50%',
        bottom: '1.5rem', // Equivalent to bottom-6 (6*0.25rem=1.5rem)
        transform: `translate(-50%, 0) translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      {/* Emoji Picker Popup */}
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

      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border border-gray-700/50 flex items-center gap-2">
        {/* Drag Handle - Improved contrast */}
        <div 
          onMouseDown={handleMouseDown}
          className="p-3 cursor-grab active:cursor-grabbing text-gray-300 hover:text-white transition-colors" // ✅ CHANGED: text-gray-300 for better contrast
          title="Drag to move controls"
        >
          <GripVertical className="w-5 h-5" />
        </div>

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

        {/* Emoji Control */}
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
  );
};

export default CallControls;

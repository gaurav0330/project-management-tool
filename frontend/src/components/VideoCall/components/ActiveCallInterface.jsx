// components/ActiveCallInterface.jsx - Add screen sharing support
import React, { useState } from 'react';
import { Monitor } from 'lucide-react'; // ✅ ADD THIS IMPORT
import VideoGrid from './VideoGrid';
import CallControls from './CallControls';
import ParticipantsSidebar from './ParticipantsSidebar';
import MeetingChat from './MeetingChat';

const ActiveCallInterface = ({ 
  currentUser, 
  userRole, 
  onEndCall,
  showParticipants,
  showChat,
  onToggleParticipants,
  onToggleChat,
  peers,
  localVideoRef,
  participants,
  toggleAudio,
  toggleVideo,
  meetingMessages,
  sendMeetingMessage,
  localStream,
  screenSharingUser, // ✅ Already added
  isScreenSharing, // ✅ Already added
  toggleScreenShare // ✅ Already added
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  console.log('🖥️ ActiveCallInterface props:', {
    peersCount: peers.size,
    participantsCount: participants.length,
    hasLocalStream: !!localStream,
    screenSharingUser, // ✅ Already added
    isScreenSharing // ✅ Already added
  });

  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    toggleAudio(!newMutedState);
  };

  const handleToggleVideo = () => {
    const newVideoState = !isVideoOn;
    setIsVideoOn(newVideoState);
    toggleVideo(newVideoState);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        <div className="h-full bg-gray-900 relative">
          <VideoGrid 
            peers={peers}
            localVideoRef={localVideoRef}
            currentUser={currentUser}
            isVideoOn={isVideoOn}
            screenSharingUser={screenSharingUser} // ✅ Already added
          />
          
          <CallControls 
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            isScreenSharing={isScreenSharing} // ✅ Already added
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onToggleScreenShare={toggleScreenShare} // ✅ Already added
            onEndCall={onEndCall}
          />

          {/* ✅ Already added: Screen Sharing Indicator */}
          {screenSharingUser && (
            <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10">
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">
                {screenSharingUser === 'local' ? 'You are sharing your screen' : 'Screen being shared'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebars */}
      {showParticipants && (
        <ParticipantsSidebar 
          participants={participants}
          currentUser={currentUser}
          userRole={userRole}
          isMuted={isMuted}
          isVideoOn={isVideoOn}
        />
      )}

      {showChat && (
        <MeetingChat 
          messages={meetingMessages}
          onSendMessage={sendMeetingMessage}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ActiveCallInterface;

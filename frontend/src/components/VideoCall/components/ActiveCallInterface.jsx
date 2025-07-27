// components/ActiveCallInterface.jsx
import React, { useState } from 'react';
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
  localStream  // ✅ ADD THIS
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  console.log('🖥️ ActiveCallInterface props:', {
    peersCount: peers.size,
    participantsCount: participants.length,
    hasLocalStream: !!localStream
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

  const handleToggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

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
          />
          
          <CallControls 
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            isScreenSharing={isScreenSharing}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onToggleScreenShare={handleToggleScreenShare}
            onEndCall={onEndCall}
          />
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

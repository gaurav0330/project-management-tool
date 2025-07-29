// components/ActiveCallInterface.jsx - Complete integration with screen sharing
import React, { useState } from 'react';
import { Monitor } from 'lucide-react';
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
  screenSharingUser,
  isScreenSharing,
  toggleScreenShare,
  cameraStream, // Camera stream when screen sharing
  localScreenStream // Screen share stream
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  console.log('🖥️ ActiveCallInterface props:', {
    peersCount: peers.size,
    participantsCount: participants.length,
    hasLocalStream: !!localStream,
    screenSharingUser,
    isScreenSharing,
    hasLocalScreenStream: !!localScreenStream,
    hasCameraStream: !!cameraStream
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
            isAudioOn={!isMuted}
            screenSharingUser={screenSharingUser}
            isScreenSharing={isScreenSharing}
            cameraStream={cameraStream}
            localScreenStream={localScreenStream}
            onToggleCamera={() => {
              console.log('Toggle camera requested');
            }}
          />
          
          <CallControls
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            isScreenSharing={isScreenSharing}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onEndCall={onEndCall}
            showParticipants={showParticipants}
            showChat={showChat}
            onToggleParticipants={onToggleParticipants}
            onToggleChat={onToggleChat}
          />

          {/* Screen Sharing Status Indicator - Only show when not in screen share mode */}
          {screenSharingUser && !isScreenSharing && (
            <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10">
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">
                {peers.get(screenSharingUser)?.user?.username || 'Someone'} is sharing their screen
              </span>
            </div>
          )}

          {/* Local Screen Sharing Indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 z-10">
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">
                You are sharing your screen
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
          screenSharingUser={screenSharingUser}
          isScreenSharing={isScreenSharing}
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
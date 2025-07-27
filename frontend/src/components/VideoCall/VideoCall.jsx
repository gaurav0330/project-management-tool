// components/VideoCall/VideoCall.jsx - Complete with Screen Sharing Support
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { Video, ArrowLeft } from "lucide-react";
import PreCallSetup from "./components/PreCallSetup";
import ActiveCallInterface from "./components/ActiveCallInterface";
import CallHeader from "./components/CallHeader";
import useVideoCall from "./hooks/useVideoCall";

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const {
    isCallActive,
    meetingId,
    groupId,
    currentUser,
    userRole,
    isLoading,
    startCall,
    endCall,
    callDuration,
    peers,
    localVideoRef,
    participants,
    participantCount,
    meetingMessages,
    toggleAudio,
    toggleVideo,
    sendMeetingMessage,
    localStream,
    screenSharingUser, // ✅ ADDED: Screen sharing user tracker
    isScreenSharing, // ✅ ADDED: Current user screen sharing state
    toggleScreenShare // ✅ ADDED: Screen sharing toggle function
  } = useVideoCall(searchParams);

  console.log('📱 VideoCall component - hasLocalStream:', !!localStream);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="rounded-full h-16 w-16 border-b-4 animate-spin border-brand-primary-600 bg-white/60"></div>
      </div>
    );
  }

  if (!meetingId) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="rounded-2xl shadow-2xl backdrop-blur-xl bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/90 max-w-md p-10 w-full mx-2 font-body text-txt-primary-light dark:text-txt-primary-dark flex flex-col items-center gap-4">
          <Video className="w-16 h-16 text-brand-primary-600 opacity-70" />
          <h2 className="text-2xl font-heading font-bold">Invalid Meeting</h2>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-center">
            No meeting ID found. Please use a valid meeting link.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-lg font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg-primary-light dark:bg-bg-primary-dark font-body overflow-hidden">
      <CallHeader
        meetingId={meetingId}
        isCallActive={isCallActive}
        callDuration={callDuration}
        navigate={navigate}
        showParticipants={showParticipants}
        showChat={showChat}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
        onToggleChat={() => setShowChat(!showChat)}
        participantsCount={participantCount || 0}
      />

      {!isCallActive ? (
        <PreCallSetup 
          currentUser={currentUser} 
          onStartCall={startCall}
          localVideoRef={localVideoRef}
        />
      ) : (
        <ActiveCallInterface
          currentUser={currentUser}
          userRole={userRole}
          onEndCall={endCall}
          showParticipants={showParticipants}
          showChat={showChat}
          onToggleParticipants={() => setShowParticipants(!showParticipants)}
          onToggleChat={() => setShowChat(!showChat)}
          peers={peers}
          localVideoRef={localVideoRef}
          participants={participants}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          meetingMessages={meetingMessages}
          sendMeetingMessage={sendMeetingMessage}
          localStream={localStream}
          screenSharingUser={screenSharingUser} // ✅ ADDED: Pass screen sharing user
          isScreenSharing={isScreenSharing} // ✅ ADDED: Pass screen sharing state
          toggleScreenShare={toggleScreenShare} // ✅ ADDED: Pass screen sharing toggle
        />
      )}
    </div>
  );
};

export default VideoCall;

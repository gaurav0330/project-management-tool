// components/VideoCall/VideoCall.jsx - Complete with Enhanced Responsive Hook Support
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { Video, ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react";
import PreCallSetup from "./components/PreCallSetup";
import ActiveCallInterface from "./components/ActiveCallInterface";
import CallHeader from "./components/CallHeader";
import useVideoCall from "./hooks/useVideoCall";
import { useResponsive } from "../../hooks/useResponsive";

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // ✅ ENHANCED: Using the updated responsive hook with width-based logic
  const { isMobile, isTablet, isDesktop, width, isMobileInDesktopMode, isTouchDevice } = useResponsive();
  
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [dismissMobileWarning, setDismissMobileWarning] = useState(false);

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
    screenSharingUser,
    isScreenSharing,
    toggleScreenShare,
    sendEmoji,
    emojiReactions
  } = useVideoCall(searchParams);

  // ✅ ENHANCED: Width-based responsive configuration
  const getResponsiveConfig = () => {
    // Mobile behavior for screens < 1024px width
    if (width < 1024) {
      return {
        containerClass: "h-screen bg-bg-primary-light dark:bg-bg-primary-dark font-body overflow-hidden relative",
        loadingSize: "h-12 w-12",
        loadingBorder: "border-2",
        errorContainerClass: "max-w-sm p-6 mx-2",
        errorIconSize: "w-12 h-12",
        errorTitleSize: "text-xl",
        errorTextSize: "text-sm",
        buttonPadding: "px-3 py-2",
        buttonTextSize: "text-sm",
        iconSize: "w-4 h-4",
        sidebarBehavior: "overlay",
        chatPosition: "bottom",
        participantsPosition: "right",
        headerHeight: "3.5rem",
        controlsHeight: "5rem",
        contentHeight: "calc(100vh - 8.5rem)",
        treatAsMobile: true
      };
    } 
    // Tablet behavior for screens 768px - 1280px width
    else if (width >= 1024 && width < 1280) {
      return {
        containerClass: "h-screen bg-bg-primary-light dark:bg-bg-primary-dark font-body overflow-hidden relative",
        loadingSize: "h-14 w-14",
        loadingBorder: "border-3",
        errorContainerClass: "max-w-md p-8 mx-4",
        errorIconSize: "w-14 h-14",
        errorTitleSize: "text-xl",
        errorTextSize: "text-base",
        buttonPadding: "px-4 py-2",
        buttonTextSize: "text-base",
        iconSize: "w-4 h-4",
        sidebarBehavior: "sidebar",
        chatPosition: "right",
        participantsPosition: "right",
        headerHeight: "3.75rem",
        controlsHeight: "4rem",
        contentHeight: "calc(100vh - 7.75rem)",
        treatAsMobile: false
      };
    } 
    // Desktop behavior for screens ≥ 1280px width
    else {
      return {
        containerClass: "h-screen bg-bg-primary-light dark:bg-bg-primary-dark font-body overflow-hidden relative",
        loadingSize: "h-16 w-16",
        loadingBorder: "border-4",
        errorContainerClass: "max-w-md p-10 mx-2",
        errorIconSize: "w-16 h-16",
        errorTitleSize: "text-2xl",
        errorTextSize: "text-base",
        buttonPadding: "px-4 py-2",
        buttonTextSize: "text-base",
        iconSize: "w-4 h-4",
        sidebarBehavior: "sidebar",
        chatPosition: "right",
        participantsPosition: "right",
        headerHeight: "4rem",
        controlsHeight: "6rem",
        contentHeight: "calc(100vh - 10rem)",
        treatAsMobile: false
      };
    }
  };

  const config = getResponsiveConfig();

  console.log('📱 VideoCall component - Enhanced Responsive:', {
    hasLocalStream: !!localStream,
    width,
    isMobile,
    isTablet,
    isDesktop,
    isMobileInDesktopMode,
    isTouchDevice,
    treatAsMobile: config.treatAsMobile
  });

  // ✅ ENHANCED: Mobile-specific handlers with width-based logic
  const handleMobileParticipantsToggle = () => {
    // Use width-based logic instead of device detection
    if (width < 1024) {
      if (showChat) setShowChat(false);
      setShowParticipants(!showParticipants);
    } else {
      setShowParticipants(!showParticipants);
    }
  };

  const handleMobileChatToggle = () => {
    // Use width-based logic instead of device detection
    if (width < 1024) {
      if (showParticipants) setShowParticipants(false);
      setShowChat(!showChat);
    } else {
      setShowChat(!showChat);
    }
  };

  // ✅ ENHANCED: Mobile Warning Component with better detection
  const MobileWarning = () => {
    // Show warning for actual mobile devices OR small screens
    const shouldShowWarning = (isTouchDevice && width < 768) || (width < 640);
    
    if (!shouldShowWarning || dismissMobileWarning) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-sm w-full p-6 text-center">
          {/* Device Icons */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="relative">
              <Smartphone className="w-12 h-12 text-red-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ArrowLeft className="w-6 h-6 text-gray-400 rotate-180" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Switch to</span>
            </div>
            <div className="space-y-2">
              <Tablet className="w-10 h-10 text-green-500 mx-auto" />
              <Monitor className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Warning Content */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Better Experience on Larger Screen
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            Video conferencing works best on tablets or desktop computers. You'll get better video quality, easier controls, and a more comfortable viewing experience.
          </p>

          {/* Device Recommendations */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">
              Recommended:
            </h3>
            <ul className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
              <li>• Desktop computer (≥1280px wide)</li>
              <li>• Tablet in landscape (≥1024px wide)</li>
              <li>• Large screen devices</li>
            </ul>
          </div>

          {/* ✅ REMOVED: Current Screen Info section */}

          {/* ✅ MODIFIED: Action Buttons - Only Go Back button */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-brand-primary-600 hover:bg-brand-primary-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Go Back
            </button>
          </div>

          {/* Additional Tips */}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>💡 Tip: Rotate to landscape mode or use a larger screen</p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="flex flex-col items-center gap-4">
          <div className={`rounded-full ${config.loadingSize} ${config.loadingBorder} animate-spin border-brand-primary-600 bg-white/60 border-t-transparent`}></div>
          {width >= 1024 && (
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm animate-pulse">
              Connecting to meeting...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!meetingId) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary-light dark:bg-bg-primary-dark p-4">
        <div className={`rounded-2xl shadow-2xl backdrop-blur-xl bg-bg-secondary-light/90 dark:bg-bg-secondary-dark/90 ${config.errorContainerClass} w-full font-body text-txt-primary-light dark:text-txt-primary-dark flex flex-col items-center gap-4 text-center`}>
          <Video className={`${config.errorIconSize} text-brand-primary-600 opacity-70`} />
          <h2 className={`${config.errorTitleSize} font-heading font-bold`}>
            Invalid Meeting
          </h2>
          <p className={`text-txt-secondary-light dark:text-txt-secondary-dark ${config.errorTextSize} ${config.treatAsMobile ? 'leading-relaxed' : ''}`}>
            No meeting ID found. Please use a valid meeting link.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${config.buttonPadding} bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${config.buttonTextSize} min-w-[120px] justify-center`}
          >
            <ArrowLeft className={config.iconSize} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Mobile Warning Overlay */}
      <MobileWarning />

      <div className={config.containerClass}>
        {/* Fixed Header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <CallHeader
            meetingId={meetingId}
            isCallActive={isCallActive}
            callDuration={callDuration}
            navigate={navigate}
            showParticipants={showParticipants}
            showChat={showChat}
            onToggleParticipants={handleMobileParticipantsToggle}
            onToggleChat={handleMobileChatToggle}
            participantsCount={participantCount || 0}
            // ✅ ENHANCED: Pass width-based responsive props
            isMobile={width < 1024}
            isTablet={width >= 1024 && width < 1280}
            isDesktop={width >= 1280}
            width={width}
            isMobileInDesktopMode={isMobileInDesktopMode}
            isTouchDevice={isTouchDevice}
          />
        </div>

        {/* Main Content Area - with proper spacing for header and controls */}
        <div 
          className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
          style={{
            paddingTop: config.headerHeight,
            paddingBottom: config.treatAsMobile ? config.controlsHeight : '2rem'
          }}
        >
          {!isCallActive ? (
            <div className="h-full overflow-auto">
              <PreCallSetup 
                currentUser={currentUser} 
                onStartCall={startCall}
                localVideoRef={localVideoRef}
                // ✅ ENHANCED: Width-based responsive props
                isMobile={width < 1024}
                isTablet={width >= 1024 && width < 1280}
                isDesktop={width >= 1280}
                width={width}
                isMobileInDesktopMode={isMobileInDesktopMode}
                config={config}
              />
            </div>
          ) : (
            <ActiveCallInterface
              currentUser={currentUser}
              userRole={userRole}
              onEndCall={endCall}
              showParticipants={showParticipants}
              showChat={showChat}
              onToggleParticipants={handleMobileParticipantsToggle}
              onToggleChat={handleMobileChatToggle}
              peers={peers}
              localVideoRef={localVideoRef}
              participants={participants}
              toggleAudio={toggleAudio}
              toggleVideo={toggleVideo}
              meetingMessages={meetingMessages}
              sendMeetingMessage={sendMeetingMessage}
              localStream={localStream}
              screenSharingUser={screenSharingUser}
              isScreenSharing={isScreenSharing}
              toggleScreenShare={toggleScreenShare}
              sendEmoji={sendEmoji}
              emojiReactions={emojiReactions}
              // ✅ ENHANCED: Width-based responsive props
              isMobile={width < 1024}
              isTablet={width >= 1024 && width < 1280}
              isDesktop={width >= 1280}
              width={width}
              isMobileInDesktopMode={isMobileInDesktopMode}
              isTouchDevice={isTouchDevice}
              config={config}
              sidebarBehavior={config.sidebarBehavior}
              chatPosition={config.chatPosition}
              participantsPosition={config.participantsPosition}
            />
          )}
        </div>

        {/* ✅ ENHANCED: Mobile Overlay Backgrounds with width-based logic */}
        {width < 1024 && (showParticipants || showChat) && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => {
              setShowParticipants(false);
              setShowChat(false);
            }}
          />
        )}

        {/* ✅ ENHANCED: Mobile Device Info Bar with better detection */}
        {width < 1024 && isCallActive && !dismissMobileWarning && (
          <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-white p-2 text-center text-xs z-30">
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>
                {isMobileInDesktopMode 
                  ? "Mobile in desktop mode - Consider using full desktop browser"
                  : "Mobile view - Switch to larger screen for better experience"
                }
              </span>
              <button
                onClick={() => setDismissMobileWarning(true)}
                className="ml-2 text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* ✅ REMOVED: Debug responsive state display */}
      </div>
    </>
  );
};

export default VideoCall;

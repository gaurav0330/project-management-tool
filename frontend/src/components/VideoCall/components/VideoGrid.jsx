// components/VideoCall/components/VideoGrid.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Monitor, VideoOff, Maximize2, Minimize2, Users, Camera, MicOff, Share, Eye, Play, Mic } from 'lucide-react';

const VideoGrid = ({ 
  peers, 
  localVideoRef, 
  currentUser, 
  isVideoOn, 
  isAudioOn = true,
  screenSharingUser, 
  isScreenSharing,
  cameraStream,
  localScreenStream,
  onToggleCamera,
  // ✅ These can now be optional since we'll detect internally
  speakingUsers = new Set(),
  isLocalSpeaking = false
}) => {
  const remoteVideoRefs = useRef(new Map());
  const cameraSidebarRef = useRef(null);
  const localScreenRef = useRef(null);
  const peerArray = Array.from(peers.entries());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showSelfCamera, setShowSelfCamera] = useState(true);

  // ✅ NEW: Internal audio detection states
  const [internalSpeakingUsers, setInternalSpeakingUsers] = useState(new Set());
  const [internalLocalSpeaking, setInternalLocalSpeaking] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRefs = useRef(new Map());
  const localAnalyserRef = useRef(null);
  const animationFrameRefs = useRef(new Map());

  // ✅ NEW: Audio level detection utility
  const setupAudioAnalysis = (stream, socketId = 'local') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      if (socketId === 'local') {
        localAnalyserRef.current = { analyser, dataArray };
      } else {
        analyserRefs.current.set(socketId, { analyser, dataArray });
      }

      return { analyser, dataArray };
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
      return null;
    }
  };

  // ✅ NEW: Detect speaking based on audio levels
  const detectSpeaking = (analyser, dataArray, threshold = 30) => {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    return average > threshold;
  };

  // ✅ NEW: Monitor audio levels
  const monitorAudioLevels = () => {
    // Check local audio
    if (localAnalyserRef.current && isAudioOn) {
      const { analyser, dataArray } = localAnalyserRef.current;
      const isCurrentlySpeaking = detectSpeaking(analyser, dataArray);
      
      if (isCurrentlySpeaking !== internalLocalSpeaking) {
        setInternalLocalSpeaking(isCurrentlySpeaking);
      }
    }

    // Check remote audio
    const newSpeakingUsers = new Set();
    analyserRefs.current.forEach(({ analyser, dataArray }, socketId) => {
      const peerData = peers.get(socketId);
      const isPeerAudioOn = peerData?.user?.isAudioOn !== false;
      
      if (isPeerAudioOn && detectSpeaking(analyser, dataArray)) {
        newSpeakingUsers.add(socketId);
      }
    });

    // Update speaking users if changed
    if (newSpeakingUsers.size !== internalSpeakingUsers.size || 
        [...newSpeakingUsers].some(id => !internalSpeakingUsers.has(id))) {
      setInternalSpeakingUsers(newSpeakingUsers);
    }

    // Continue monitoring
    const frameId = requestAnimationFrame(monitorAudioLevels);
    animationFrameRefs.current.set('monitor', frameId);
  };

  // ✅ NEW: Setup audio analysis for local stream
  useEffect(() => {
    const setupLocalAudio = async () => {
      try {
        if (isAudioOn && localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject;
          const audioTracks = stream.getAudioTracks();
          
          if (audioTracks.length > 0) {
            setupAudioAnalysis(stream, 'local');
          }
        }
      } catch (error) {
        console.error('Error setting up local audio analysis:', error);
      }
    };

    setupLocalAudio();
  }, [isAudioOn, localVideoRef.current?.srcObject]);

  // ✅ NEW: Setup audio analysis for remote streams
  useEffect(() => {
    peerArray.forEach(([socketId, peerData]) => {
      const videoElement = remoteVideoRefs.current.get(socketId);
      
      if (videoElement && peerData.stream && videoElement.srcObject !== peerData.stream) {
        videoElement.srcObject = peerData.stream;
        videoElement.play().catch(console.error);

        // Setup audio analysis for this peer
        const audioTracks = peerData.stream.getAudioTracks();
        if (audioTracks.length > 0 && !analyserRefs.current.has(socketId)) {
          setupAudioAnalysis(peerData.stream, socketId);
        }
      }
    });

    // Clean up analysers for disconnected peers
    analyserRefs.current.forEach((_, socketId) => {
      if (!peers.has(socketId)) {
        analyserRefs.current.delete(socketId);
      }
    });
  }, [peerArray]);

  // ✅ NEW: Start audio monitoring
  useEffect(() => {
    // Start monitoring when component mounts
    monitorAudioLevels();

    return () => {
      // Cleanup on unmount
      animationFrameRefs.current.forEach((frameId) => {
        cancelAnimationFrame(frameId);
      });
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle local screen stream
  useEffect(() => {
    if (isScreenSharing && localScreenStream && localScreenRef.current) {
      if (localScreenRef.current.srcObject !== localScreenStream) {
        localScreenRef.current.srcObject = localScreenStream;
        localScreenRef.current.play().catch(console.error);
      }
    }
  }, [isScreenSharing, localScreenStream]);

  // Handle camera stream for sidebar
  useEffect(() => {
    if (isScreenSharing && cameraStream && cameraSidebarRef.current) {
      if (cameraSidebarRef.current.srcObject !== cameraStream) {
        cameraSidebarRef.current.srcObject = cameraStream;
        cameraSidebarRef.current.play().catch(console.error);

        // ✅ Setup audio analysis for camera stream too
        const audioTracks = cameraStream.getAudioTracks();
        if (audioTracks.length > 0) {
          setupAudioAnalysis(cameraStream, 'local-camera');
        }
      }
    }
  }, [isScreenSharing, cameraStream]);

  // ✅ Combine internal detection with external props
  const effectiveSpeakingUsers = new Set([...speakingUsers, ...internalSpeakingUsers]);
  const effectiveLocalSpeaking = isLocalSpeaking || internalLocalSpeaking;

  // Layout logic
  let gridClass = 'grid gap-3 h-full p-3';
  let containerClass = 'h-full';

  if (screenSharingUser || isScreenSharing) {
    containerClass = showParticipants ? 'h-full flex gap-3 p-3' : 'h-full p-0';
  } else {
    if (peerArray.length === 0) gridClass += ' grid-cols-1';
    else if (peerArray.length === 1) gridClass += ' grid-cols-2';
    else if (peerArray.length <= 3) gridClass += ' grid-cols-2';
    else if (peerArray.length <= 8) gridClass += ' grid-cols-3';
    else gridClass += ' grid-cols-4';
  }

  const handleFullscreen = (videoElement) => {
    if (!videoElement) return;
    
    if (!isFullscreen) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Get screen sharer info
  const getScreenSharerInfo = () => {
    if (isScreenSharing) {
      return { username: currentUser?.username || 'You', isLocal: true };
    } else if (screenSharingUser) {
      const peer = peerArray.find(([socketId]) => socketId === screenSharingUser);
      return { username: peer?.[1]?.user?.username || 'Someone', isLocal: false };
    }
    return null;
  };

  const screenSharerInfo = getScreenSharerInfo();

  // SCREEN SHARING LAYOUT
  if (screenSharingUser || isScreenSharing) {
    const screenSharingPeer = peerArray.find(([socketId]) => socketId === screenSharingUser);
    const isLocalScreenSharing = Boolean(isScreenSharing);
    
    return (
      <div className={containerClass}>
        {/* Main Screen Share Area */}
        <div className="flex-1 relative">
          <div className="relative bg-black rounded-xl overflow-hidden h-full">
            {/* Screen Share Content */}
            {isLocalScreenSharing ? (
              // Local screen sharing card
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
                <div className="text-center p-8 max-w-lg">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
                      <Monitor className="w-12 h-12 text-white" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Screen Share Active
                  </h2>
                  <p className="text-blue-200 text-lg mb-6">
                    You're sharing your screen with {peerArray.length} participant{peerArray.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="flex justify-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Eye className="w-6 h-6 text-blue-300" />
                      </div>
                      <div className="text-white font-semibold">{peerArray.length}</div>
                      <div className="text-blue-300 text-sm">Viewers</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Share className="w-6 h-6 text-green-300" />
                      </div>
                      <div className="text-white font-semibold">Live</div>
                      <div className="text-blue-300 text-sm">Status</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                    <p className="text-blue-100 text-sm">
                      <span className="font-semibold">💡 Tip:</span> Your camera is visible in the bottom-right corner
                    </p>
                  </div>
                </div>
              </div>
            ) : screenSharingPeer ? (
              // Remote screen share
              <video
                ref={(el) => {
                  if (el) {
                    remoteVideoRefs.current.set(screenSharingUser, el);
                    if (screenSharingPeer[1]?.stream && el.srcObject !== screenSharingPeer[1].stream) {
                      el.srcObject = screenSharingPeer[1].stream;
                      el.play().catch(console.error);
                    }
                  }
                }}
                className="w-full h-full object-contain bg-black"
                autoPlay
                playsInline
                muted={false}
              />
            ) : (
              // Waiting state
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Monitor className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Connecting...</h3>
                  <p className="text-gray-400">Screen sharing is starting</p>
                </div>
              </div>
            )}

            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-3">
                <div className="relative">
                  <Monitor className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">
                  {isLocalScreenSharing ? 'You are sharing' : `${screenSharerInfo?.username} is sharing`}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="bg-black/80 hover:bg-black/90 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                  title={showParticipants ? "Hide Participants" : "Show Participants"}
                >
                  <Users className="w-4 h-4" />
                </button>

                {!isLocalScreenSharing && (
                  <button
                    onClick={() => handleFullscreen(remoteVideoRefs.current.get(screenSharingUser))}
                    className="bg-black/80 hover:bg-black/90 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* ✅ CLEANED: Simple speaking indicator - only show when actually speaking */}
            {((isLocalScreenSharing && effectiveLocalSpeaking && isAudioOn) || 
              (!isLocalScreenSharing && effectiveSpeakingUsers.has(screenSharingUser))) && (
              <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLocalScreenSharing ? 'You are speaking' : `${screenSharerInfo?.username} is speaking`}
                </span>
              </div>
            )}

            {/* ✅ CLEANED: Camera preview with minimal speaking border */}
            {isLocalScreenSharing && showSelfCamera && cameraStream && (
              <div className={`absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden shadow-xl transition-all duration-300 ${
                (effectiveLocalSpeaking && isAudioOn) ? 'border-4 border-green-400' : 'border-2 border-green-500'
              }`}>
                <video
                  ref={cameraSidebarRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Your Camera
                </div>
                <button
                  onClick={() => setShowSelfCamera(false)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            )}

            {/* Show Camera Button */}
            {isLocalScreenSharing && !showSelfCamera && (
              <button
                onClick={() => setShowSelfCamera(true)}
                className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors shadow-lg"
                title="Show Camera"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-72 flex flex-col gap-3 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">Participants</h3>
                <span className="text-gray-400 text-xs">{peerArray.length + 1}</span>
              </div>
              {/* ✅ CLEANED: Simple speaking count */}
              {(effectiveLocalSpeaking || effectiveSpeakingUsers.size > 0) && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                  <Mic className="w-3 h-3" />
                  <span>
                    {effectiveLocalSpeaking && effectiveSpeakingUsers.size > 0 
                      ? `You and ${effectiveSpeakingUsers.size} other${effectiveSpeakingUsers.size > 1 ? 's' : ''} speaking`
                      : effectiveLocalSpeaking 
                        ? 'You are speaking'
                        : `${effectiveSpeakingUsers.size} participant${effectiveSpeakingUsers.size > 1 ? 's' : ''} speaking`
                    }
                  </span>
                </div>
              )}
            </div>

            {!isLocalScreenSharing && (
              <ParticipantVideo
                videoRef={localVideoRef}
                username="You"
                isVideoOn={isVideoOn}
                isAudioOn={isAudioOn}
                currentUser={currentUser}
                isLocal={true}
                isSpeaking={effectiveLocalSpeaking}
                speakingUsers={effectiveSpeakingUsers}
              />
            )}

            {peerArray
              .filter(([socketId]) => socketId !== screenSharingUser)
              .map(([socketId, peerData]) => (
                <ParticipantVideo
                  key={socketId}
                  socketId={socketId}
                  peerData={peerData}
                  remoteVideoRefs={remoteVideoRefs}
                  isSpeaking={effectiveSpeakingUsers.has(socketId)}
                  speakingUsers={effectiveSpeakingUsers}
                />
              ))}

            {screenSharingPeer && !isLocalScreenSharing && (
              <ParticipantVideo
                socketId={`${screenSharingUser}-camera`}
                peerData={screenSharingPeer[1]}
                remoteVideoRefs={remoteVideoRefs}
                isPresenter={true}
                isSpeaking={effectiveSpeakingUsers.has(screenSharingUser)}
                speakingUsers={effectiveSpeakingUsers}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // NORMAL VIDEO CALL LAYOUT
  return (
    <div className={gridClass}>
      {peerArray.map(([socketId, peerData]) => (
        <ParticipantVideo
          key={socketId}
          socketId={socketId}
          peerData={peerData}
          remoteVideoRefs={remoteVideoRefs}
          isLarge={true}
          isSpeaking={effectiveSpeakingUsers.has(socketId)}
          speakingUsers={effectiveSpeakingUsers}
        />
      ))}

      <ParticipantVideo
        videoRef={localVideoRef}
        username="You"
        isVideoOn={isVideoOn}
        isAudioOn={isAudioOn}
        currentUser={currentUser}
        isLocal={true}
        isLarge={true}
        isSpeaking={effectiveLocalSpeaking}
        speakingUsers={effectiveSpeakingUsers}
      />
    </div>
  );
};

// ✅ CLEANED & CORRECTED: ParticipantVideo component with minimal speaking animation
const ParticipantVideo = ({ 
  videoRef, 
  socketId, 
  peerData, 
  remoteVideoRefs, 
  username, 
  isVideoOn, 
  isAudioOn, 
  currentUser, 
  isLocal = false, 
  isPresenter = false,
  isLarge = false,
  isSpeaking = false,
  speakingUsers = new Set()
}) => {
  const isPeerVideoOn = isLocal ? isVideoOn : (peerData?.user?.isVideoOn !== false && 
    peerData?.stream?.getVideoTracks().some(track => track.enabled));

  const isPeerAudioOn = isLocal 
    ? isAudioOn 
    : (peerData?.user?.isAudioOn !== false &&
       peerData?.stream?.getAudioTracks().some(track => track.readyState === 'live' && track.enabled));

  const displayName = isLocal ? username : (peerData?.user?.username || 'Participant');
  const containerClass = isLarge ? 'rounded-2xl' : 'rounded-xl';
  const iconSize = isLarge ? 'w-4 h-4' : 'w-3 h-3';

  // ✅ FIXED: Only show speaking animation if mic is on AND actually speaking
  const shouldShowSpeaking = isSpeaking && isPeerAudioOn;

  return (
    <div
      className={`relative bg-gray-800 ${containerClass} overflow-hidden ${
        isLarge ? '' : 'aspect-video'
      } ${isPresenter ? 'border-2 border-blue-500' : ''} ${
        shouldShowSpeaking ? 'border-4 border-green-400 transition-all duration-300' : 'border-2 border-transparent'
      }`}
    >
      <video
        ref={isLocal ? videoRef : (el) => {
          if (el && socketId) {
            remoteVideoRefs.current.set(socketId, el);
            if (!isLocal && peerData?.stream && el.srcObject !== peerData.stream) {
              el.srcObject = peerData.stream;
              el.play().catch(console.error);
            }
          }
        }}
        className={`w-full h-full object-cover ${isPeerVideoOn ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        playsInline
        muted={isLocal}
      />

      {/* ✅ CLEANED: Simple avatar when video is off */}
      {!isPeerVideoOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* ✅ CLEANED: Status icons - no extra animations */}
      <div className="absolute top-2 left-2 flex gap-1">
        {!isPeerVideoOn && (
          <div className="bg-red-600 p-1 rounded-full">
            <VideoOff className={iconSize + ' text-white'} />
          </div>
        )}
        {!isPeerAudioOn && (
          <div className="bg-red-600 p-1 rounded-full">
            <MicOff className={iconSize + ' text-white'} />
          </div>
        )}
      </div>

      {/* ✅ CLEANED: Presenter badge - simple version */}
      {isPresenter && (
        <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded bg-blue-600">
          Presenter
        </div>
      )}

      {/* ✅ CLEANED: Username label - no speaking color change */}
      <div className="absolute bottom-2 left-2 backdrop-blur-sm rounded px-2 py-1 bg-black/70">
        <span className="text-white text-xs font-medium">{displayName}</span>
      </div>
    </div>
  );
};

export default VideoGrid;

// components/VideoCall/components/VideoGrid.jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Monitor, VideoOff, Maximize2, Users, Camera, MicOff, Share, Eye, Play, Mic } from 'lucide-react';

const VideoGrid = ({ 
  peers, localVideoRef, currentUser, isVideoOn, isAudioOn = true,
  screenSharingUser, isScreenSharing, cameraStream, localScreenStream,
  onToggleCamera, speakingUsers = new Set(), isLocalSpeaking = false, socket,
  sendEmoji, // ✅ NEW
  emojiReactions, // ✅ NEW: Assume each reaction has { id, emoji, x, y, sender: username }
}) => {
  const remoteVideoRefs = useRef(new Map());
  const cameraSidebarRef = useRef(null);
  const peerArray = Array.from(peers.entries());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showSelfCamera, setShowSelfCamera] = useState(true);

  // Voice detection states
  const [voiceStrengths, setVoiceStrengths] = useState(new Map());
  const [localVoiceStrength, setLocalVoiceStrength] = useState(0);
  const [internalSpeakingUsers, setInternalSpeakingUsers] = useState(new Set());
  const [internalLocalSpeaking, setInternalLocalSpeaking] = useState(false);
  const [networkSpeakingUsers, setNetworkSpeakingUsers] = useState(new Set());
  
  const audioContextRef = useRef(null);
  const analyserRefs = useRef(new Map());
  const localAnalyserRef = useRef(null);
  const animationFrameRefs = useRef(new Map());

  // ✅ ADD: Debug rendering only when reactions change (prevents log spam)
  useEffect(() => {
    if (emojiReactions.length > 0) {
      console.log('🖼️ Emoji reactions updated:', emojiReactions);
    }
  }, [emojiReactions]); // Only logs when reactions array changes

  // ✅ ADD: Memoize emoji list to prevent unnecessary re-renders
  const memoizedEmojis = useMemo(() => emojiReactions, [emojiReactions]);

  // Audio analysis setup
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

  // Voice strength calculation
  const detectSpeakingWithStrength = (analyser, dataArray, threshold = 20) => {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const strength = Math.min(100, Math.max(0, (average - 10) * 2));
    return { isSpeaking: strength > threshold, strength: Math.round(strength) };
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const handlePeerSpeaking = ({ socketId, isSpeaking, voiceStrength = 0 }) => {
      setNetworkSpeakingUsers(prev => {
        const newSet = new Set(prev);
        isSpeaking ? newSet.add(socketId) : newSet.delete(socketId);
        return newSet;
      });
      setVoiceStrengths(prev => new Map(prev).set(socketId, voiceStrength));
    };
    socket.on("peer-speaking", handlePeerSpeaking);
    return () => socket.off("peer-speaking", handlePeerSpeaking);
  }, [socket]);

  // Socket emission
  useEffect(() => {
    if (!socket || !currentUser || !localAnalyserRef.current || !isAudioOn) return;
    let intervalId, lastSpeakingState = null;

    const checkAndEmitSpeaking = () => {
      if (!localAnalyserRef.current || !isAudioOn) {
        if (lastSpeakingState !== false) {
          socket.emit("user-speaking", { 
            socketId: socket.id || currentUser.id,
            username: currentUser.username || 'You',
            isSpeaking: false, voiceStrength: 0, timestamp: Date.now()
          });
          lastSpeakingState = false;
        }
        return;
      }
      const { analyser, dataArray } = localAnalyserRef.current;
      const { isSpeaking, strength } = detectSpeakingWithStrength(analyser, dataArray);
      
      if (isSpeaking !== lastSpeakingState) {
        socket.emit("user-speaking", { 
          socketId: socket.id || currentUser.id,
          username: currentUser.username || 'You',
          isSpeaking: isSpeaking && isAudioOn,
          voiceStrength: isSpeaking ? strength : 0,
          timestamp: Date.now()
        });
        lastSpeakingState = isSpeaking;
      }
    };

    intervalId = setInterval(checkAndEmitSpeaking, 200);
    return () => {
      clearInterval(intervalId);
      if (socket && lastSpeakingState === true) {
        socket.emit("user-speaking", { 
          socketId: socket.id || currentUser.id,
          isSpeaking: false, voiceStrength: 0
        });
      }
    };
  }, [socket, currentUser, isAudioOn, localAnalyserRef.current]);

  // Audio monitoring
  const monitorAudioLevels = () => {
    if (localAnalyserRef.current && isAudioOn) {
      const { analyser, dataArray } = localAnalyserRef.current;
      const { isSpeaking, strength } = detectSpeakingWithStrength(analyser, dataArray);
      
      if (isSpeaking !== internalLocalSpeaking) setInternalLocalSpeaking(isSpeaking);
      setLocalVoiceStrength(isSpeaking && isAudioOn ? strength : 0);
    } else {
      if (internalLocalSpeaking) {
        setInternalLocalSpeaking(false);
        setLocalVoiceStrength(0);
      }
    }

    const newSpeakingUsers = new Set();
    const newVoiceStrengths = new Map();
    
    analyserRefs.current.forEach(({ analyser, dataArray }, socketId) => {
      const peerData = peers.get(socketId);
      const isPeerAudioOn = peerData?.user?.isAudioOn !== false;
      
      if (isPeerAudioOn) {
        const { isSpeaking, strength } = detectSpeakingWithStrength(analyser, dataArray);
        if (isSpeaking && isPeerAudioOn) {
          newSpeakingUsers.add(socketId);
          if (!voiceStrengths.has(socketId)) newVoiceStrengths.set(socketId, strength);
        } else if (!voiceStrengths.has(socketId)) {
          newVoiceStrengths.set(socketId, 0);
        }
      } else {
        newVoiceStrengths.set(socketId, 0);
      }
    });

    networkSpeakingUsers.forEach(socketId => newSpeakingUsers.add(socketId));
    
    if (newSpeakingUsers.size !== internalSpeakingUsers.size || 
        [...newSpeakingUsers].some(id => !internalSpeakingUsers.has(id))) {
      setInternalSpeakingUsers(newSpeakingUsers);
    }

    voiceStrengths.forEach((strength, socketId) => newVoiceStrengths.set(socketId, strength));
    setVoiceStrengths(newVoiceStrengths);

    const frameId = requestAnimationFrame(monitorAudioLevels);
    animationFrameRefs.current.set('monitor', frameId);
  };

  // Setup effects
  useEffect(() => {
    const setupLocalAudio = async () => {
      try {
        if (isAudioOn && localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject;
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) setupAudioAnalysis(stream, 'local');
        }
      } catch (error) {
        console.error('Error setting up local audio analysis:', error);
      }
    };
    setupLocalAudio();
  }, [isAudioOn, localVideoRef.current?.srcObject]);

  useEffect(() => {
    peerArray.forEach(([socketId, peerData]) => {
      const videoElement = remoteVideoRefs.current.get(socketId);
      if (videoElement && peerData.stream && videoElement.srcObject !== peerData.stream) {
        videoElement.srcObject = peerData.stream;
        videoElement.play().catch(console.error);
        const audioTracks = peerData.stream.getAudioTracks();
        if (audioTracks.length > 0 && !analyserRefs.current.has(socketId)) {
          setupAudioAnalysis(peerData.stream, socketId);
        }
      }
    });

    analyserRefs.current.forEach((_, socketId) => {
      if (!peers.has(socketId)) {
        analyserRefs.current.delete(socketId);
        setVoiceStrengths(prev => { const newMap = new Map(prev); newMap.delete(socketId); return newMap; });
        setNetworkSpeakingUsers(prev => { const newSet = new Set(prev); newSet.delete(socketId); return newSet; });
      }
    });
  }, [peerArray]);

  useEffect(() => {
    monitorAudioLevels();
    return () => {
      animationFrameRefs.current.forEach(cancelAnimationFrame);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Stream setup effects
  useEffect(() => {
    if (isScreenSharing && cameraStream && cameraSidebarRef.current) {
      if (cameraSidebarRef.current.srcObject !== cameraStream) {
        cameraSidebarRef.current.srcObject = cameraStream;
        cameraSidebarRef.current.play().catch(console.error);
        const audioTracks = cameraStream.getAudioTracks();
        if (audioTracks.length > 0) setupAudioAnalysis(cameraStream, 'local-camera');
      }
    }
  }, [isScreenSharing, cameraStream]);

  // Combined speaking data
  const effectiveSpeakingUsers = new Set([...speakingUsers, ...internalSpeakingUsers, ...networkSpeakingUsers]);
  const effectiveLocalSpeaking = (isLocalSpeaking || internalLocalSpeaking) && isAudioOn;

  // Layout calculations
  const getGridClass = () => {
    if (screenSharingUser || isScreenSharing) return showParticipants ? 'h-full flex gap-3 p-3' : 'h-full p-0';
    const cols = peerArray.length === 0 ? 1 : peerArray.length === 1 ? 2 : peerArray.length <= 3 ? 2 : peerArray.length <= 8 ? 3 : 4;
    return `grid grid-cols-${cols} gap-3 h-full p-3`;
  };

  // Utility functions
  const handleFullscreen = (videoElement) => {
    if (!videoElement) return;
    if (!isFullscreen) {
      (videoElement.requestFullscreen || videoElement.webkitRequestFullscreen)?.call(videoElement);
      setIsFullscreen(true);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      setIsFullscreen(false);
    }
  };

  const getScreenSharerInfo = () => {
    if (isScreenSharing) return { username: currentUser?.username || 'You', isLocal: true };
    if (screenSharingUser) {
      const peer = peerArray.find(([socketId]) => socketId === screenSharingUser);
      return { username: peer?.[1]?.user?.username || 'Someone', isLocal: false };
    }
    return null;
  };

  const screenSharerInfo = getScreenSharerInfo();

  // ✅ UPDATED: Function to render 5 simultaneous floating emojis + sender name
const renderEmojiBurst = (reaction) => {
  const elements = [];
  const minVertDist = 5; // Minimum vertical distance between rows (in %)
  const minHorzDist = 5; // Minimum horizontal distance between emojis in a row (in %)

  // Define pyramid layout offsets (bottom to top for floating effect):
  // Bottom row (starting lowest): 3 emojis
  // Middle row: 2 emojis
  // Top row: 1 emoji
  // All will float upward from their initial positions
  const layout = [
    // Top row (highest initial position)
    { x: 0, y: 0 }, // Centered

    // Middle row (below top)
    { x: -minHorzDist / 2, y: minVertDist },
    { x: minHorzDist / 2, y: minVertDist },

    // Bottom row (lowest, widest)
    { x: -minHorzDist, y: 2 * minVertDist },
    { x: 0, y: 2 * minVertDist },
    { x: minHorzDist, y: 2 * minVertDist },
  ];

  layout.forEach((offset, i) => {
    // Apply random crossing class to all for dynamic paths
    elements.push(
      <div
        key={`${reaction.id}-${i}`}
        className="absolute pointer-events-none text-4xl emoji-float emoji-random-cross"
        style={{
          left: `${Math.min(100, Math.max(0, reaction.x + offset.x))}%`,
          top: `${Math.min(100, Math.max(0, reaction.y + offset.y))}%`,
        }}
      >
        {reaction.emoji}
      </div>
    );
  });

  // Add sender name display below the pyramid
  elements.push(
    <div
      key={`${reaction.id}-sender`}
      className="absolute pointer-events-none text-sm text-white bg-black/60 px-2 py-1 rounded emoji-sender-float"
      style={{
        left: `${Math.min(100, Math.max(0, reaction.x))}%`,
        top: `${Math.min(100, Math.max(0, reaction.y + 3 * minVertDist))}%`, // Positioned below the bottom row
      }}
    >
      {reaction.sender || 'Anonymous'}
    </div>
  );

  return elements;
};




  // Render screen sharing layout
  if (screenSharingUser || isScreenSharing) {
    const screenSharingPeer = peerArray.find(([socketId]) => socketId === screenSharingUser);
    const isLocalScreenSharing = Boolean(isScreenSharing);
    
    return (
      <div className={getGridClass()}>
        <div className="flex-1 relative">
          <div className="relative bg-black rounded-xl overflow-hidden h-full">
            {/* Screen content */}
            {isLocalScreenSharing ? (
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
                  <h2 className="text-3xl font-bold text-white mb-3">Screen Share Active</h2>
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
                autoPlay playsInline muted={false}
              />
            ) : (
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

            {/* ✅ UPDATED: Emoji Reactions with 5 Simultaneous Floating Emojis */}
            {memoizedEmojis.length > 0 && (
              <div className="absolute inset-0 pointer-events-none z-[9999]">
                {memoizedEmojis.map((reaction) => renderEmojiBurst(reaction))}
              </div>
            )}

            {/* Controls */}
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

            {/* Speaking indicator */}
            {((isLocalScreenSharing && effectiveLocalSpeaking) || 
              (!isLocalScreenSharing && effectiveSpeakingUsers.has(screenSharingUser))) && (
              <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLocalScreenSharing ? 'You are speaking' : `${screenSharerInfo?.username} is speaking`}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(3)].map((_, i) => {
                    const strength = isLocalScreenSharing ? localVoiceStrength : (voiceStrengths.get(screenSharingUser) || 0);
                    const isActive = strength > (i + 1) * 25;
                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-200 ${isActive ? 'bg-white' : 'bg-white/30'}`}
                        style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 100}ms` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Camera preview */}
            {isLocalScreenSharing && showSelfCamera && cameraStream && (
              <VoiceAnimatedContainer 
                voiceStrength={localVoiceStrength}
                isActive={effectiveLocalSpeaking}
                className="absolute bottom-4 right-4 w-48 h-36"
              >
                <video
                  ref={cameraSidebarRef}
                  className="w-full h-full object-cover"
                  autoPlay muted playsInline
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
              </VoiceAnimatedContainer>
            )}

            {/* Show camera button */}
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

        {/* Participants sidebar */}
        {showParticipants && (
          <div className="w-72 flex flex-col gap-3 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">Participants</h3>
                <span className="text-gray-400 text-xs">{peerArray.length + 1}</span>
              </div>
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
                  <div className="flex items-center gap-1 ml-1">
                    {[...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-3 bg-green-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isLocalScreenSharing && (
              <ParticipantVideo
                videoRef={localVideoRef} username="You" isVideoOn={isVideoOn} isAudioOn={isAudioOn}
                currentUser={currentUser} isLocal={true} isSpeaking={effectiveLocalSpeaking}
                voiceStrength={localVoiceStrength} speakingUsers={effectiveSpeakingUsers}
              />
            )}

            {peerArray
              .filter(([socketId]) => socketId !== screenSharingUser)
              .map(([socketId, peerData]) => {
                const isPeerAudioOn = peerData?.user?.isAudioOn !== false;
                const isRemoteSpeaking = isPeerAudioOn && effectiveSpeakingUsers.has(socketId);
                return (
                  <ParticipantVideo
                    key={socketId} socketId={socketId} peerData={peerData}
                    remoteVideoRefs={remoteVideoRefs} isSpeaking={isRemoteSpeaking}
                    voiceStrength={voiceStrengths.get(socketId) || 0} speakingUsers={effectiveSpeakingUsers}
                  />
                );
              })}

            {screenSharingPeer && !isLocalScreenSharing && (
              <ParticipantVideo
                socketId={`${screenSharingUser}-camera`} peerData={screenSharingPeer[1]}
                remoteVideoRefs={remoteVideoRefs} isPresenter={true}
                isSpeaking={screenSharingPeer[1]?.user?.isAudioOn && effectiveSpeakingUsers.has(screenSharingUser)}
                voiceStrength={voiceStrengths.get(screenSharingUser) || 0} speakingUsers={effectiveSpeakingUsers}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Normal video layout
  return (
    <div className={getGridClass()}>
      {/* ✅ UPDATED: Emoji Reactions with 5 Simultaneous Floating Emojis */}
      {memoizedEmojis.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-[9999]">
          {memoizedEmojis.map((reaction) => renderEmojiBurst(reaction))}
        </div>
      )}

      {peerArray.map(([socketId, peerData]) => {
        const isPeerAudioOn = peerData?.user?.isAudioOn !== false;
        const isRemoteSpeaking = isPeerAudioOn && effectiveSpeakingUsers.has(socketId);
        return (
          <ParticipantVideo
            key={socketId} socketId={socketId} peerData={peerData}
            remoteVideoRefs={remoteVideoRefs} isLarge={true} isSpeaking={isRemoteSpeaking}
            voiceStrength={voiceStrengths.get(socketId) || 0} speakingUsers={effectiveSpeakingUsers}
          />
        );
      })}
      <ParticipantVideo
        videoRef={localVideoRef} username="You" isVideoOn={isVideoOn} isAudioOn={isAudioOn}
        currentUser={currentUser} isLocal={true} isLarge={true} isSpeaking={effectiveLocalSpeaking}
        voiceStrength={localVoiceStrength} speakingUsers={effectiveSpeakingUsers}
      />
    </div>
  );
};

// Voice animated container - Fixed CSS
const VoiceAnimatedContainer = ({ children, voiceStrength, isActive, className }) => {
  // ✅ ADD: Voice pulse animation styles
  const voicePulseStyles = `
    @keyframes voicePulse { 
      0%, 100% { opacity: 1; } 
      50% { opacity: 0.8; } 
    }
  `;

  // ✅ ADD: Inject voice pulse CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = voicePulseStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const getAnimationStyle = () => {
    if (!isActive || voiceStrength === 0) {
      return { borderColor: 'rgb(34, 197, 94)', borderWidth: '2px', boxShadow: 'none', transform: 'scale(1)' };
    }
    const intensity = Math.min(voiceStrength / 100, 1);
    const scale = 1 + (intensity * 0.05);
    const glowIntensity = intensity * 20;
    const pulseSpeed = Math.max(0.5, 1 - intensity * 0.5);
    return {
      borderColor: `rgba(34, 197, 94, ${0.8 + intensity * 0.2})`,
      borderWidth: `${2 + intensity * 3}px`,
      boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, ${intensity * 0.6})`,
      transform: `scale(${scale})`,
      transition: 'all 0.1s ease-out',
      animation: `voicePulse ${pulseSpeed}s ease-in-out infinite`
    };
  };

  return (
    <div className={`${className} bg-gray-900 rounded-lg overflow-hidden shadow-xl`} style={getAnimationStyle()}>
      {children}
      {isActive && voiceStrength > 0 && (
        <div className="absolute bottom-2 right-2 flex items-end gap-1">
          {[...Array(5)].map((_, i) => {
            const barHeight = Math.max(4, (voiceStrength / 100) * 20 * (i + 1) / 5);
            const isActiveBar = voiceStrength > (i * 20);
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${isActiveBar ? 'bg-green-400' : 'bg-gray-600'}`}
                style={{ height: `${barHeight}px`, animationDelay: `${i * 50}ms` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Participant video component
const ParticipantVideo = ({ 
  videoRef, socketId, peerData, remoteVideoRefs, username, isVideoOn, isAudioOn, 
  currentUser, isLocal = false, isPresenter = false, isLarge = false, 
  isSpeaking = false, voiceStrength = 0, speakingUsers = new Set()
}) => {
  const isPeerVideoOn = isLocal ? isVideoOn : (peerData?.user?.isVideoOn !== false && 
    peerData?.stream?.getVideoTracks().some(track => track.enabled));
  const isPeerAudioOn = isLocal ? isAudioOn : (peerData?.user?.isAudioOn !== false &&
    peerData?.stream?.getAudioTracks().some(track => track.readyState === 'live' && track.enabled));
  const displayName = isLocal ? username : (peerData?.user?.username || 'Participant');
  const containerClass = isLarge ? 'rounded-2xl' : 'rounded-xl';
  const iconSize = isLarge ? 'w-4 h-4' : 'w-3 h-3';
  const shouldShowSpeaking = isSpeaking && isPeerAudioOn;

  const getVoiceStyle = () => {
    if (!shouldShowSpeaking || voiceStrength === 0) {
      return { borderColor: 'transparent', borderWidth: '2px', boxShadow: 'none', transform: 'scale(1)' };
    }
    const intensity = Math.min(voiceStrength / 100, 1);
    const scale = 1 + (intensity * 0.02);
    const glowIntensity = intensity * 15;
    const borderWidth = 2 + intensity * 4;
    return {
      borderColor: `rgba(34, 197, 94, ${0.7 + intensity * 0.3})`,
      borderWidth: `${borderWidth}px`,
      boxShadow: `0 0 ${glowIntensity}px rgba(34, 197, 94, ${intensity * 0.5})`,
      transform: `scale(${scale})`,
      transition: 'all 0.15s ease-out'
    };
  };

  return (
    <div
      className={`relative bg-gray-800 ${containerClass} overflow-hidden ${
        isLarge ? '' : 'aspect-video'
      } ${isPresenter ? 'border-2 border-blue-500' : ''}`}
      style={getVoiceStyle()}
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
        autoPlay playsInline muted={isLocal}
      />

      {!isPeerVideoOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
            shouldShowSpeaking ? 'bg-green-500 animate-pulse' : 'bg-blue-600'
          }`}>
            {displayName.charAt(0).toUpperCase()}
            {shouldShowSpeaking && voiceStrength > 0 && (
              <div 
                className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping"
                style={{ 
                  borderWidth: `${Math.max(2, voiceStrength / 25)}px`,
                  animationDuration: `${Math.max(0.5, 1.5 - voiceStrength / 100)}s`
                }}
              />
            )}
          </div>
        </div>
      )}

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
        {shouldShowSpeaking && (
          <div className="bg-green-500 p-1 rounded-full relative">
            <Mic className={iconSize + ' text-white'} />
            <div 
              className="absolute inset-0 bg-green-400 rounded-full animate-ping"
              style={{ 
                animationDuration: `${Math.max(0.5, 1.2 - voiceStrength / 150)}s`,
                opacity: Math.min(0.8, voiceStrength / 100)
              }}
            />
          </div>
        )}
      </div>

      {isPresenter && (
        <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded transition-all duration-300 ${
          shouldShowSpeaking ? 'bg-green-600' : 'bg-blue-600'
        }`}>
          {shouldShowSpeaking ? 'Speaking' : 'Presenter'}
        </div>
      )}

      {shouldShowSpeaking && voiceStrength > 0 && (
        <div className="absolute bottom-2 right-2 flex items-end gap-1">
          {[...Array(4)].map((_, i) => {
            const barHeight = Math.max(3, (voiceStrength / 100) * 16 * (i + 1) / 4);
            const isActiveBar = voiceStrength > (i * 25);
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-100 ${
                  isActiveBar ? 'bg-green-400' : 'bg-green-400/30'
                }`}
                style={{ height: `${barHeight}px`, animationDelay: `${i * 50}ms` }}
              />
            );
          })}
        </div>
      )}

      <div className={`absolute bottom-2 left-2 backdrop-blur-sm rounded px-2 py-1 transition-all duration-300 ${
        shouldShowSpeaking ? 'bg-green-600/80' : 'bg-black/70'
      }`}>
        <span className="text-white text-xs font-medium">{displayName}</span>
      </div>
    </div>
  );
};

export default VideoGrid;
